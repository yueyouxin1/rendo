import { createHash } from "node:crypto";
import path from "node:path";
import { copyTreeWithReplacements, ensureMissingOrEmptyDir, slugify, writeJsonFile } from "./fs.js";
import { projectManifestSchema, templateManifestSchema, type TemplateManifest } from "./contracts.js";
import { readJsonFile } from "./fs.js";
import { promises as fs } from "node:fs";
import type { PreparedTemplateSource } from "./registry-client.js";

export type ScaffoldResult = {
  targetDir: string;
  templateId: string;
  copiedFiles: string[];
  selectedSurfaces: string[];
  nextSteps: string[];
};

export type WorkspaceCreationMode = "rendo.init" | "rendo.create" | "rendo.pull";
export type TemplateWorkspaceOptions = {
  asTemplate?: boolean;
  templateId?: string;
  templateName?: string;
  templateTitle?: string;
};

function humanizeTemplateId(templateId: string) {
  return templateId
    .replaceAll("/", "-")
    .replaceAll("_", "-")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Derived Template";
}

function resolveSelectedSurfaces(manifest: TemplateManifest, requestedSurfaces?: string[]) {
  if (manifest.surfaceCapabilities.length === 0) {
    return [];
  }

  const selected = requestedSurfaces?.length
    ? requestedSurfaces
    : manifest.defaultSurfaces.length
      ? manifest.defaultSurfaces
      : ["web"];

  const invalid = selected.filter((surface) => !manifest.surfaceCapabilities.includes(surface as any));
  if (invalid.length > 0) {
    throw new Error(`unsupported surfaces for ${manifest.id}: ${invalid.join(", ")}`);
  }

  if (!selected.includes("web")) {
    throw new Error(`current implementation requires the web surface; requested surfaces: ${selected.join(", ")}`);
  }

  return [...new Set(selected)];
}

async function pruneUnselectedSurfaces(
  targetDir: string,
  manifest: TemplateManifest,
  selectedSurfaces: string[],
): Promise<void> {
  if (manifest.surfaceCapabilities.length === 0) {
    return;
  }

  for (const surface of manifest.surfaceCapabilities) {
    if (selectedSurfaces.includes(surface)) {
      continue;
    }
    const paths = manifest.surfacePaths[surface] ?? [];
    for (const relativePath of paths) {
      await fs.rm(path.join(targetDir, relativePath), { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
    }
  }
}

function buildWorkspaceId(templateId: string, projectName: string, createdAt: string) {
  const slug = slugify(projectName) || "workspace";
  const digest = createHash("sha256")
    .update(`${templateId}:${slug}:${createdAt}`)
    .digest("hex")
    .slice(0, 12);
  return `ws-${slug}-${digest}`;
}

async function persistWorkspaceMetadata(
  source: PreparedTemplateSource,
  targetDir: string,
  selectedRuntimeMode: string,
  selectedSurfaces: string[],
  creationMode: WorkspaceCreationMode,
  localTemplateIdentity: { id: string; name: string; title: string },
) {
  const projectManifestPath = path.join(targetDir, "rendo.project.json");
  const templateManifestPath = path.join(targetDir, "rendo.template.json");
  const workspaceProjectManifestPath = path.join(targetDir, ".rendo", "rendo.project.json");
  const workspaceTemplateManifestPath = path.join(targetDir, ".rendo", "rendo.template.json");
  const manifest = source.manifest;
  const project = projectManifestSchema.parse(await readJsonFile(projectManifestPath));
  project.surfaces = selectedSurfaces as any;
  project.template.id = localTemplateIdentity.id;
  project.template.templateRole = "derived";
  project.workspaceId = buildWorkspaceId(localTemplateIdentity.id, project.projectName, project.template.createdAt);
  project.origin = {
    createdBy: creationMode,
    registry: source.registry,
    source: source.source,
    templateId: manifest.id,
    templateKind: manifest.templateKind,
    templateRole: manifest.templateRole,
    templateVersion: manifest.version,
    runtimeMode: selectedRuntimeMode as any,
  };

  const template = templateManifestSchema.parse(await readJsonFile(templateManifestPath));
  template.id = localTemplateIdentity.id;
  template.name = localTemplateIdentity.name;
  template.title = localTemplateIdentity.title;
  template.templateRole = "derived";

  await writeJsonFile(workspaceProjectManifestPath, project);
  await writeJsonFile(workspaceTemplateManifestPath, template);
  await fs.rm(projectManifestPath, { force: true });
  await fs.rm(templateManifestPath, { force: true });
}

export async function scaffoldTemplate(
  source: PreparedTemplateSource,
  requestedTargetDir: string,
  runtimeMode?: string,
  requestedSurfaces?: string[],
  creationMode: WorkspaceCreationMode = "rendo.create",
  templateWorkspaceOptions: TemplateWorkspaceOptions = {},
): Promise<ScaffoldResult> {
  const targetDir = path.resolve(requestedTargetDir);
  await ensureMissingOrEmptyDir(targetDir);
  const manifest = source.manifest;
  const projectName = path.basename(targetDir);
  const projectSlug = slugify(projectName);
  const selectedRuntimeMode = runtimeMode ?? manifest.runtimeModes[0];
  const createdAt = process.env.RENDO_CREATED_AT_OVERRIDE ?? new Date().toISOString();
  const selectedSurfaces = resolveSelectedSurfaces(manifest, requestedSurfaces);
  if (templateWorkspaceOptions.asTemplate && !templateWorkspaceOptions.templateId) {
    throw new Error("template workspaces require --template-id");
  }
  const localTemplateIdentity = {
    id: templateWorkspaceOptions.templateId ?? manifest.id,
    name: templateWorkspaceOptions.templateName ?? humanizeTemplateId(templateWorkspaceOptions.templateId ?? manifest.id),
    title: templateWorkspaceOptions.templateTitle ?? templateWorkspaceOptions.templateName ?? humanizeTemplateId(templateWorkspaceOptions.templateId ?? manifest.id),
  };
  const copiedFiles = await copyTreeWithReplacements(
    source.templateDir,
    targetDir,
    {
      "__RENDO_PROJECT_NAME__": projectName,
      "__RENDO_PROJECT_SLUG__": projectSlug,
      "__RENDO_TEMPLATE_ID__": localTemplateIdentity.id,
      "__RENDO_TEMPLATE_TITLE__": localTemplateIdentity.title,
      "__RENDO_TEMPLATE_KIND__": manifest.templateKind,
      "__RENDO_TEMPLATE_ROLE__": manifest.templateRole,
      "__RENDO_TEMPLATE_VERSION__": manifest.version,
      "__RENDO_RUNTIME_MODE__": selectedRuntimeMode,
      "__RENDO_CREATED_AT__": createdAt,
      "__RENDO_SELECTED_SURFACES__": selectedSurfaces.join(", ") || "none",
    },
  );
  await pruneUnselectedSurfaces(targetDir, manifest, selectedSurfaces);
  await persistWorkspaceMetadata(source, targetDir, selectedRuntimeMode, selectedSurfaces, creationMode, localTemplateIdentity);
  const normalizedCopiedFiles = copiedFiles
    .filter((relativePath) => relativePath !== "rendo.project.json" && relativePath !== "rendo.template.json")
    .concat([".rendo/rendo.project.json", ".rendo/rendo.template.json"]);

  const nextSteps = [
    `cd ${targetDir}`,
    "npm install",
    "npm run health",
    "npm run check",
  ];

  return {
    targetDir,
    templateId: localTemplateIdentity.id,
    copiedFiles: normalizedCopiedFiles,
    selectedSurfaces,
    nextSteps,
  };
}
