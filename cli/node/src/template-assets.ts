import { promises as fs } from "node:fs";
import path from "node:path";
import { computeDirectoryDigest } from "./bundle.js";
import { appendMissingEnv, compareVersions, copyTemplateAsset, pathExists } from "./fs.js";
import { loadProjectState, saveProjectManifest } from "./project.js";
import { prepareTemplateSource, type PreparedTemplateSource, type RegistryOptions } from "./registry-client.js";

export type TemplateInstallPreview = {
  templateId: string;
  templateKind: string;
  templateRole: string;
  runtimeMode: string;
  targetPath: string;
  targetRoot: string;
  installPlan: {
    addsFiles: string[];
    updatesFiles: string[];
    deletesFiles: string[];
    addsEnv: string[];
    addsRoutes: string[];
    addsPages: string[];
    addsComponents: string[];
    addsMigrations: boolean;
    addsWorkerTasks: boolean;
    addsAdminModules: boolean;
    requiresManualSetup: boolean;
  };
  conflicts: string[];
  registry: string;
  source: "local" | "remote";
  bundleDigest: string | null;
  templateDigest: string | null;
};

function assertCompatibleHost(
  manifest: PreparedTemplateSource["manifest"],
  hostTemplate: { id: string; templateKind: string; version: string },
): void {
  const compatibility = manifest.compatibility.hosts;
  if (compatibility.length === 0) {
    return;
  }

  const matched = compatibility.find((item) => item.templateId === hostTemplate.id || item.templateKind === hostTemplate.templateKind);
  if (!matched) {
    throw new Error(`template ${manifest.id} does not apply to host ${hostTemplate.id}`);
  }
  if (matched.minVersion && compareVersions(hostTemplate.version, matched.minVersion) < 0) {
    throw new Error(`template ${manifest.id} requires host ${matched.templateId} >= ${matched.minVersion}`);
  }
  if (matched.maxVersion && compareVersions(hostTemplate.version, matched.maxVersion) > 0) {
    throw new Error(`template ${manifest.id} requires host ${matched.templateId} <= ${matched.maxVersion}`);
  }
}

function resolveInstallMode(manifest: PreparedTemplateSource["manifest"], runtimeMode: string) {
  if (!manifest.assetInstall) {
    throw new Error(`template ${manifest.id} does not expose install metadata`);
  }

  const mode = manifest.assetInstall.modes.find((item) => item.runtimeMode === runtimeMode)
    ?? manifest.assetInstall.modes.find((item) => item.runtimeMode === "source");
  if (!mode) {
    throw new Error(`template ${manifest.id} does not support host runtime mode ${runtimeMode}`);
  }
  return mode;
}

async function listConflicts(targetPath: string, conflictStrategy: string): Promise<string[]> {
  if (!(await pathExists(targetPath))) {
    return [];
  }
  if (conflictStrategy === "skip") {
    return [];
  }
  if (conflictStrategy === "overwrite") {
    return ["target directory already exists and will be overwritten"];
  }
  return ["target directory already exists"];
}

export async function previewTemplateAssetInstall(source: PreparedTemplateSource, projectRoot: string): Promise<TemplateInstallPreview> {
  const manifest = source.manifest;
  if (manifest.templateKind === "starter-template") {
    throw new Error(`use rendo create for starter templates: ${manifest.id}`);
  }

  const { project } = await loadProjectState(projectRoot);
  assertCompatibleHost(manifest, project.template);
  const installMode = resolveInstallMode(manifest, project.template.runtimeMode);
  const targetPath = path.join(projectRoot, installMode.targetRoot, manifest.id);

  return {
    templateId: manifest.id,
    templateKind: manifest.templateKind,
    templateRole: manifest.templateRole,
    runtimeMode: installMode.runtimeMode,
    targetPath,
    targetRoot: installMode.targetRoot,
    installPlan: installMode.install,
    conflicts: await listConflicts(targetPath, installMode.conflictStrategy),
    registry: source.registry,
    source: source.source,
    bundleDigest: source.bundleDigest,
    templateDigest: source.templateDigest,
  };
}

export async function installTemplateAsset(source: PreparedTemplateSource, projectRoot: string) {
  const manifest = source.manifest;
  const preview = await previewTemplateAssetInstall(source, projectRoot);
  const installMode = resolveInstallMode(manifest, preview.runtimeMode);
  if (preview.conflicts.length > 0 && installMode.conflictStrategy === "fail") {
    throw new Error(`template install conflicts: ${preview.conflicts.join("; ")}`);
  }

  if (await pathExists(preview.targetPath)) {
    if (installMode.conflictStrategy === "overwrite") {
      await fs.rm(preview.targetPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
    } else if (installMode.conflictStrategy === "skip") {
      return {
        templateId: manifest.id,
        templateKind: manifest.templateKind,
        templateRole: manifest.templateRole,
        targetPath: preview.targetPath,
        copiedFiles: [],
        addedEnv: [],
        installPlan: preview.installPlan,
        skipped: true,
      };
    }
  }

  const copiedFiles = await copyTemplateAsset(source.templateDir, preview.targetPath);
  const addedEnv = await appendMissingEnv(path.join(projectRoot, ".env.example"), preview.installPlan.addsEnv);

  const { project } = await loadProjectState(projectRoot);
  const record = {
    id: manifest.id,
    version: manifest.version,
    templateKind: manifest.templateKind,
    templateRole: manifest.templateRole,
    runtimeMode: project.template.runtimeMode,
    registry: source.registry,
    source: source.source,
    bundleDigest: source.bundleDigest,
    templateDigest: source.templateDigest,
    targetPath: path.relative(projectRoot, preview.targetPath).replaceAll("\\", "/"),
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
    targetPath: preview.targetPath,
    copiedFiles,
    addedEnv,
    installPlan: preview.installPlan,
  };
}

export async function upgradeTemplateAssets(
  projectRoot: string,
  options?: RegistryOptions & { templateRef?: string; preview?: boolean },
) {
  const { project } = await loadProjectState(projectRoot);
  const candidates = options?.templateRef
    ? project.installedTemplates.filter((item) => item.id === options.templateRef)
    : project.installedTemplates;

  if (candidates.length === 0) {
    throw new Error(options?.templateRef ? `template is not installed: ${options.templateRef}` : "no template assets installed in project");
  }

  const results: Array<Record<string, unknown>> = [];

  for (const installed of candidates) {
    const source = await prepareTemplateSource(installed.id, options);
    if (!source) {
      results.push({
        templateId: installed.id,
        currentVersion: installed.version,
        status: "missing-from-registry",
      });
      continue;
    }

    try {
      const targetPath = path.join(projectRoot, installed.targetPath);
      const currentDigest = (await pathExists(targetPath)) ? (await computeDirectoryDigest(targetPath)).value : null;
      if (installed.templateDigest && currentDigest && installed.templateDigest !== currentDigest) {
        results.push({
          templateId: installed.id,
          currentVersion: installed.version,
          latestVersion: source.manifest.version,
          status: "manual-intervention",
          reason: "local modifications detected",
        });
        continue;
      }

      const preview = await previewTemplateAssetInstall(source, projectRoot);
      const sameVersion = compareVersions(installed.version, source.manifest.version) >= 0;
      const sameDigest = installed.templateDigest && source.templateDigest && installed.templateDigest === source.templateDigest;
      if (sameVersion && sameDigest) {
        results.push({
          templateId: installed.id,
          currentVersion: installed.version,
          latestVersion: source.manifest.version,
          status: "up-to-date",
        });
        continue;
      }

      if (options?.preview) {
        results.push({
          templateId: installed.id,
          currentVersion: installed.version,
          latestVersion: source.manifest.version,
          status: "preview",
          installPlan: preview.installPlan,
        });
        continue;
      }

      if (await pathExists(targetPath)) {
        await fs.rm(targetPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
      }
      const applied = await installTemplateAsset(source, projectRoot);
      results.push({
        templateId: installed.id,
        currentVersion: installed.version,
        latestVersion: source.manifest.version,
        status: "upgraded",
        installPlan: applied.installPlan,
      });
    } finally {
      await source.cleanup();
    }
  }

  return results;
}
