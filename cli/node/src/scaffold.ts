import path from "node:path";
import { copyTreeWithReplacements, ensureMissingOrEmptyDir, slugify, writeJsonFile } from "./fs.js";
import { loadTemplateManifest } from "./registry.js";
import { projectManifestSchema, type TemplateRegistryEntry, type TemplateManifest } from "./contracts.js";
import { readJsonFile } from "./fs.js";
import { promises as fs } from "node:fs";

export type ScaffoldResult = {
  targetDir: string;
  templateId: string;
  copiedFiles: string[];
  selectedSurfaces: string[];
  nextSteps: string[];
};

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

async function persistProjectSurfaces(targetDir: string, selectedSurfaces: string[]) {
  const manifestPath = path.join(targetDir, "rendo.project.json");
  const payload = projectManifestSchema.parse(await readJsonFile(manifestPath));
  payload.surfaces = selectedSurfaces as any;
  await writeJsonFile(manifestPath, payload);
}

export async function scaffoldTemplate(
  entry: TemplateRegistryEntry,
  requestedTargetDir: string,
  runtimeMode?: string,
  requestedSurfaces?: string[],
): Promise<ScaffoldResult> {
  const targetDir = path.resolve(requestedTargetDir);
  await ensureMissingOrEmptyDir(targetDir);
  const manifest = await loadTemplateManifest(entry);
  const projectName = path.basename(targetDir);
  const projectSlug = slugify(projectName);
  const selectedRuntimeMode = runtimeMode ?? manifest.runtimeModes[0];
  const createdAt = process.env.RENDO_CREATED_AT_OVERRIDE ?? new Date().toISOString();
  const selectedSurfaces = resolveSelectedSurfaces(manifest, requestedSurfaces);
  const copiedFiles = await copyTreeWithReplacements(
    path.resolve(entry.templatePath),
    targetDir,
    {
      "__RENDO_PROJECT_NAME__": projectName,
      "__RENDO_PROJECT_SLUG__": projectSlug,
      "__RENDO_TEMPLATE_ID__": manifest.id,
      "__RENDO_TEMPLATE_TITLE__": manifest.title,
      "__RENDO_TEMPLATE_KIND__": manifest.templateKind,
      "__RENDO_TEMPLATE_ROLE__": manifest.templateRole,
      "__RENDO_TEMPLATE_VERSION__": manifest.version,
      "__RENDO_RUNTIME_MODE__": selectedRuntimeMode,
      "__RENDO_CREATED_AT__": createdAt,
      "__RENDO_SELECTED_SURFACES__": selectedSurfaces.join(", ") || "none",
    },
  );
  await pruneUnselectedSurfaces(targetDir, manifest, selectedSurfaces);
  await persistProjectSurfaces(targetDir, selectedSurfaces);

  const nextSteps = [
    `cd ${targetDir}`,
    "pnpm install",
    "pnpm docker:up",
  ];

  return {
    targetDir,
    templateId: manifest.id,
    copiedFiles,
    selectedSurfaces,
    nextSteps,
  };
}
