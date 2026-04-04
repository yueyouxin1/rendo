import path from "node:path";
import { appendMissingEnv, copyTemplateAsset, repoRoot } from "./fs.js";
import { loadProjectState, saveProjectManifest } from "./project.js";
import { loadTemplateManifest } from "./registry.js";
import type { TemplateRegistryEntry } from "./contracts.js";

const templateInstallRoots: Record<string, string> = {
  "feature-template": "features",
  "capability-template": "capabilities",
  "provider-template": "providers",
  "surface-template": "surfaces",
};

export async function installTemplateAsset(templateEntry: TemplateRegistryEntry, projectRoot: string) {
  const manifest = await loadTemplateManifest(templateEntry);
  if (manifest.templateKind === "starter-template") {
    throw new Error(`use rendo create for starter templates: ${manifest.id}`);
  }

  const installRoot = templateInstallRoots[manifest.templateKind];
  if (!installRoot) {
    throw new Error(`unsupported template kind for add: ${manifest.templateKind}`);
  }

  const targetPath = path.join(projectRoot, installRoot, manifest.id);
  const copiedFiles = await copyTemplateAsset(path.join(repoRoot, templateEntry.templatePath), targetPath);
  const addedEnv = await appendMissingEnv(path.join(projectRoot, ".env.example"), manifest.requiredEnv);

  const { project } = await loadProjectState(projectRoot);
  const record = {
    id: manifest.id,
    templateKind: manifest.templateKind,
    templateRole: manifest.templateRole,
    targetPath: path.relative(projectRoot, targetPath).replaceAll("\\", "/"),
    installedAt: process.env.RENDO_INSTALLED_AT_OVERRIDE ?? new Date().toISOString(),
  };
  const existingIndex = project.installedTemplates.findIndex((item) => item.id === manifest.id);
  if (existingIndex >= 0) {
    project.installedTemplates[existingIndex] = record;
  } else {
    project.installedTemplates.push(record);
  }
  await saveProjectManifest(projectRoot, project);

  return {
    templateId: manifest.id,
    templateKind: manifest.templateKind,
    templateRole: manifest.templateRole,
    targetPath,
    copiedFiles,
    addedEnv,
  };
}
