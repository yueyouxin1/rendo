import { promises as fs } from "node:fs";
import path from "node:path";
import {
  projectManifestSchema,
  templateManifestSchema,
  type ProjectManifest,
  type TemplateManifest,
} from "./contracts.js";
import { pathExists, readJsonFile, writeJsonFile } from "./fs.js";

const workspaceMetadataDirName = ".rendo";
const projectManifestFileName = "rendo.project.json";
const templateManifestFileName = "rendo.template.json";

function workspaceMetadataPaths(projectRoot: string) {
  const workspaceMetadataDir = path.join(projectRoot, workspaceMetadataDirName);
  return {
    workspaceProjectManifestPath: path.join(workspaceMetadataDir, projectManifestFileName),
    workspaceTemplateManifestPath: path.join(workspaceMetadataDir, templateManifestFileName),
    legacyProjectManifestPath: path.join(projectRoot, projectManifestFileName),
    legacyTemplateManifestPath: path.join(projectRoot, templateManifestFileName),
  };
}

async function resolveWorkspaceMetadata(projectRoot: string) {
  const paths = workspaceMetadataPaths(projectRoot);
  const [
    hasWorkspaceProjectManifest,
    hasWorkspaceTemplateManifest,
    hasLegacyProjectManifest,
    hasLegacyTemplateManifest,
  ] = await Promise.all([
    pathExists(paths.workspaceProjectManifestPath),
    pathExists(paths.workspaceTemplateManifestPath),
    pathExists(paths.legacyProjectManifestPath),
    pathExists(paths.legacyTemplateManifestPath),
  ]);

  return {
    ...paths,
    hasWorkspaceProjectManifest,
    hasWorkspaceTemplateManifest,
    hasLegacyProjectManifest,
    hasLegacyTemplateManifest,
  };
}

async function readProjectManifest(metadata: Awaited<ReturnType<typeof resolveWorkspaceMetadata>>) {
  if (metadata.hasWorkspaceProjectManifest) {
    return projectManifestSchema.parse(await readJsonFile<ProjectManifest>(metadata.workspaceProjectManifestPath));
  }
  if (metadata.hasLegacyProjectManifest) {
    return projectManifestSchema.parse(await readJsonFile<ProjectManifest>(metadata.legacyProjectManifestPath));
  }
  return null;
}

async function readTemplateManifest(metadata: Awaited<ReturnType<typeof resolveWorkspaceMetadata>>) {
  if (metadata.hasWorkspaceTemplateManifest) {
    return templateManifestSchema.parse(await readJsonFile<TemplateManifest>(metadata.workspaceTemplateManifestPath));
  }
  if (metadata.hasLegacyTemplateManifest) {
    return templateManifestSchema.parse(await readJsonFile<TemplateManifest>(metadata.legacyTemplateManifestPath));
  }
  return null;
}

async function removeLegacyMetadataFiles(
  metadata: Awaited<ReturnType<typeof resolveWorkspaceMetadata>>,
  options?: { removeProject?: boolean; removeTemplate?: boolean },
) {
  if (options?.removeProject ?? true) {
    await fs.rm(metadata.legacyProjectManifestPath, { force: true });
  }
  if (options?.removeTemplate ?? true) {
    await fs.rm(metadata.legacyTemplateManifestPath, { force: true });
  }
}

export async function findProjectRoot(startDir: string): Promise<string | null> {
  let current = path.resolve(startDir);

  while (true) {
    const metadata = await resolveWorkspaceMetadata(current);
    const hasProjectManifest = metadata.hasWorkspaceProjectManifest || metadata.hasLegacyProjectManifest;
    const hasTemplateManifest = metadata.hasWorkspaceTemplateManifest || metadata.hasLegacyTemplateManifest;
    if (hasProjectManifest && hasTemplateManifest) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

export async function loadProjectState(projectRoot: string): Promise<{
  project: ProjectManifest;
  template: TemplateManifest;
}> {
  const metadata = await resolveWorkspaceMetadata(projectRoot);
  const project = await readProjectManifest(metadata);
  const template = await readTemplateManifest(metadata);
  if (!project || !template) {
    throw new Error(`no rendo project found at ${projectRoot}`);
  }
  return { project, template };
}

export async function saveProjectManifest(projectRoot: string, manifest: ProjectManifest): Promise<void> {
  const metadata = await resolveWorkspaceMetadata(projectRoot);
  const template = await readTemplateManifest(metadata);
  await writeJsonFile(metadata.workspaceProjectManifestPath, manifest);
  if (template) {
    await writeJsonFile(metadata.workspaceTemplateManifestPath, template);
  }
  await removeLegacyMetadataFiles(metadata, { removeProject: true, removeTemplate: Boolean(template) });
}

export async function readEnvKeys(envFilePath: string): Promise<Set<string>> {
  if (!(await pathExists(envFilePath))) {
    return new Set();
  }

  const content = await fs.readFile(envFilePath, "utf8");
  return new Set(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("=", 1)[0]?.trim())
      .filter(Boolean),
  );
}
