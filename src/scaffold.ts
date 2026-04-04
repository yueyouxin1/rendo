import path from "node:path";
import { copyTreeWithReplacements, ensureMissingOrEmptyDir, slugify } from "./fs.js";
import { loadStarterManifest } from "./registry.js";
import type { StarterRegistryEntry } from "./contracts.js";

export type ScaffoldResult = {
  targetDir: string;
  starterId: string;
  copiedFiles: string[];
  nextSteps: string[];
};

export async function scaffoldStarter(
  entry: StarterRegistryEntry,
  requestedTargetDir: string,
  runtimeMode?: string,
): Promise<ScaffoldResult> {
  const targetDir = path.resolve(requestedTargetDir);
  await ensureMissingOrEmptyDir(targetDir);
  const manifest = await loadStarterManifest(entry);
  const projectName = path.basename(targetDir);
  const projectSlug = slugify(projectName);
  const selectedRuntimeMode = runtimeMode ?? manifest.runtimeModes[0];
  const copiedFiles = await copyTreeWithReplacements(
    path.resolve(entry.templatePath),
    targetDir,
    {
      "__RENDO_PROJECT_NAME__": projectName,
      "__RENDO_PROJECT_SLUG__": projectSlug,
      "__RENDO_STARTER_ID__": manifest.id,
      "__RENDO_STARTER_TITLE__": manifest.title,
      "__RENDO_TEMPLATE_VERSION__": manifest.version,
      "__RENDO_RUNTIME_MODE__": selectedRuntimeMode,
      "__RENDO_CREATED_AT__": new Date().toISOString(),
    },
  );

  const nextSteps = [
    `cd ${targetDir}`,
    "pnpm install",
    "pnpm docker:up",
  ];

  return {
    targetDir,
    starterId: manifest.id,
    copiedFiles,
    nextSteps,
  };
}
