import path from "node:path";
import { appendMissingEnv, compareVersions, copyTreeWithReplacements, pathExists, repoRoot } from "./fs.js";
import { type InstallPlan, type PackRegistryEntry } from "./contracts.js";
import { loadPackManifest, resolvePackRef } from "./registry.js";
import { loadProjectState, saveProjectManifest } from "./project.js";

export type PackApplyResult = {
  pack: string;
  version: string;
  targetDir: string;
  copiedFiles: string[];
  addedEnv: string[];
  installPlan: InstallPlan;
};

async function assertPackAppliesToProject(packEntry: PackRegistryEntry, projectRoot: string): Promise<void> {
  const manifest = await loadPackManifest(packEntry);
  if (manifest.appliesTo.length === 0) {
    return;
  }

  const { template } = await loadProjectState(projectRoot);
  if (!manifest.appliesTo.includes(template.id)) {
    throw new Error(`pack ${manifest.name} does not apply to starter ${template.id}`);
  }
}

export async function installPack(
  packEntry: PackRegistryEntry,
  projectRoot: string,
): Promise<PackApplyResult> {
  await assertPackAppliesToProject(packEntry, projectRoot);

  const manifest = await loadPackManifest(packEntry);
  const sourceDir = path.join(repoRoot, packEntry.filesPath);
  const relativeFileTargets = [...manifest.install.addsFiles, ...manifest.install.updatesFiles];

  for (const relativeFile of relativeFileTargets) {
    if (!(await pathExists(path.join(sourceDir, relativeFile)))) {
      throw new Error(`pack file declared in install plan is missing: ${relativeFile}`);
    }
  }

  const copiedFiles = await copyTreeWithReplacements(sourceDir, projectRoot, {});
  const envFile = path.join(projectRoot, ".env.example");
  const addedEnv = await appendMissingEnv(envFile, manifest.install.addsEnv);

  const { project } = await loadProjectState(projectRoot);
  const existingIndex = project.installedPacks.findIndex((item) => item.name === manifest.name);
  const record = {
    name: manifest.name,
    version: manifest.version,
    runtimeMode: manifest.runtimeMode,
    provider: manifest.provider,
    installedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    project.installedPacks[existingIndex] = record;
  } else {
    project.installedPacks.push(record);
  }

  await saveProjectManifest(projectRoot, project);

  return {
    pack: manifest.name,
    version: manifest.version,
    targetDir: projectRoot,
    copiedFiles,
    addedEnv,
    installPlan: manifest.install,
  };
}

export async function previewPack(packEntry: PackRegistryEntry) {
  const manifest = await loadPackManifest(packEntry);
  return {
    name: manifest.name,
    version: manifest.version,
    runtimeMode: manifest.runtimeMode,
    provider: manifest.provider,
    requiredEnv: manifest.requiredEnv,
    dependencies: manifest.dependencies,
    install: manifest.install,
    official: packEntry.official,
  };
}

export async function upgradePacks(projectRoot: string, requestedPack?: string) {
  const { project } = await loadProjectState(projectRoot);
  const candidates = requestedPack
    ? project.installedPacks.filter((item) => item.name === requestedPack)
    : project.installedPacks;

  if (candidates.length === 0) {
    throw new Error(requestedPack ? `pack is not installed: ${requestedPack}` : "no packs installed in project");
  }

  const results: Array<{
    pack: string;
    currentVersion: string;
    latestVersion: string;
    status: "upgraded" | "up-to-date";
  }> = [];

  for (const installed of candidates) {
    const packEntry = await resolvePackRef(installed.name);
    if (!packEntry) {
      throw new Error(`pack no longer exists in registry: ${installed.name}`);
    }
    const manifest = await loadPackManifest(packEntry);
    if (compareVersions(installed.version, manifest.version) >= 0) {
      results.push({
        pack: installed.name,
        currentVersion: installed.version,
        latestVersion: manifest.version,
        status: "up-to-date",
      });
      continue;
    }

    await installPack(packEntry, projectRoot);
    results.push({
      pack: installed.name,
      currentVersion: installed.version,
      latestVersion: manifest.version,
      status: "upgraded",
    });
  }

  return results;
}
