import { spawnSync } from "node:child_process";
import path from "node:path";
import { templateManifestSchema } from "./contracts.js";
import { findProjectRoot, loadProjectState, readEnvKeys } from "./project.js";
import { pathExists, readJsonFile } from "./fs.js";
import { loadPackManifest, resolvePackRef } from "./registry.js";
import { prepareTemplateSource } from "./registry-client.js";
import { previewTemplateAssetIntegration } from "./template-assets.js";

type CheckStatus = "pass" | "warn" | "fail";

type Check = {
  name: string;
  status: CheckStatus;
  detail: string;
};

function describeCommandOutput(result: ReturnType<typeof spawnSync>) {
  const stdout = typeof result.stdout === "string" ? result.stdout.trim() : "";
  const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
  return stdout || stderr || "ok";
}

function commandCandidates(command: string): string[] {
  if (process.platform !== "win32" || /\.[a-z0-9]+$/i.test(command)) {
    return [command];
  }
  return [`${command}.cmd`, `${command}.exe`, command];
}

function runCommand(command: string, args: string[]): Check {
  let lastError = "command not available";
  for (const candidate of commandCandidates(command)) {
    const result = spawnSync(candidate, args, {
      encoding: "utf8",
      shell: process.platform === "win32",
    });
    if (result.error) {
      lastError = result.error.message;
      continue;
    }
    if (result.status === 0) {
      return {
        name: `${command} ${args.join(" ")}`.trim(),
        status: "pass",
        detail: describeCommandOutput(result),
      };
    }

    return {
      name: `${command} ${args.join(" ")}`.trim(),
      status: "fail",
      detail: describeCommandOutput(result),
    };
  }
  return {
    name: `${command} ${args.join(" ")}`.trim(),
    status: "fail",
    detail: lastError,
  };
}

async function verifyDeclaredPaths(projectRoot: string, paths: string[]) {
  const missing: string[] = [];
  for (const relativePath of paths) {
    if (!(await pathExists(path.join(projectRoot, relativePath)))) {
      missing.push(relativePath);
    }
  }
  return missing;
}

function normalizeRelativePath(projectRoot: string, targetPath: string) {
  return path.relative(projectRoot, targetPath).replaceAll("\\", "/");
}

export async function runDoctor(cwd: string) {
  const checks: Check[] = [
    runCommand("node", ["-v"]),
    runCommand("npm", ["-v"]),
    runCommand("python", ["--version"]),
    runCommand("docker", ["--version"]),
    runCommand("docker", ["compose", "version"]),
  ];

  const projectRoot = await findProjectRoot(cwd);
  if (!projectRoot) {
    checks.push({
      name: "project root",
      status: "warn",
      detail: "no rendo project found from current directory upward",
    });
    return { cwd, checks };
  }

  const { project, template } = await loadProjectState(projectRoot);
  checks.push({
    name: "starter manifest",
    status: "pass",
    detail: `${template.id}@${template.version} (${template.type})`,
  });
  checks.push({
    name: "template architecture standard",
    status: "pass",
    detail: template.architecture.standard,
  });
  checks.push({
    name: "template host model",
    status: "pass",
    detail: template.architecture.hostModel,
  });
  checks.push({
    name: "template runtime class",
    status: "pass",
    detail: template.architecture.runtimeClass,
  });

  const architectureChecks: Array<{ name: string; paths: string[] }> = [
    { name: "template agent entrypoints", paths: template.architecture.rootPaths.agentEntrypoints },
    { name: "template interface roots", paths: template.architecture.rootPaths.interfaces },
    { name: "template implementation roots", paths: template.architecture.rootPaths.implementation },
    { name: "template test roots", paths: template.architecture.rootPaths.tests },
    { name: "template integration roots", paths: template.architecture.rootPaths.integration },
    { name: "template operations roots", paths: template.architecture.rootPaths.operations },
    { name: "template mount roots", paths: template.architecture.rootPaths.mounts },
  ];

  for (const architectureCheck of architectureChecks) {
    const missing = await verifyDeclaredPaths(projectRoot, architectureCheck.paths);
    checks.push({
      name: architectureCheck.name,
      status: missing.length === 0 ? "pass" : "fail",
      detail:
        missing.length === 0
          ? architectureCheck.paths.join(", ") || "(none)"
          : `missing paths: ${missing.join(", ")}`,
    });
  }

  const envKeys = await readEnvKeys(path.join(projectRoot, ".env.example"));
  const missingTemplateEnv = template.requiredEnv.filter((key) => !envKeys.has(key));
  checks.push({
    name: "template env coverage",
    status: missingTemplateEnv.length === 0 ? "pass" : "warn",
    detail:
      missingTemplateEnv.length === 0
        ? "all template env keys are represented in .env.example"
        : `missing in .env.example: ${missingTemplateEnv.join(", ")}`,
  });

  for (const installedPack of project.installedPacks) {
    const packEntry = await resolvePackRef(installedPack.name);
    if (!packEntry) {
      checks.push({
        name: `pack ${installedPack.name}`,
        status: "warn",
        detail: "installed in project manifest but missing from registry",
      });
      continue;
    }

    const manifest = await loadPackManifest(packEntry);
    const missingPackEnv = manifest.requiredEnv.filter((key) => !envKeys.has(key));
    checks.push({
      name: `pack ${manifest.name}`,
      status: missingPackEnv.length === 0 ? "pass" : "warn",
      detail:
        missingPackEnv.length === 0
          ? `${manifest.version} ready`
          : `missing in .env.example: ${missingPackEnv.join(", ")}`,
    });
  }

  for (const installedTemplate of project.installedTemplates) {
    const source = await prepareTemplateSource(installedTemplate.id);
    if (!source) {
      checks.push({
        name: `installed template ${installedTemplate.id} registry metadata`,
        status: "warn",
        detail: "installed in project manifest but missing from template registry",
      });
      continue;
    }

    try {
      const preview = await previewTemplateAssetIntegration(source, projectRoot);
      const expectedTargetPath = normalizeRelativePath(projectRoot, preview.targetPath);
      checks.push({
        name: `installed template ${installedTemplate.id} target root`,
        status: expectedTargetPath === installedTemplate.targetPath ? "pass" : "fail",
        detail:
          expectedTargetPath === installedTemplate.targetPath
            ? `${preview.targetRoot} -> ${installedTemplate.targetPath}`
            : `expected ${expectedTargetPath} from ${preview.targetRoot}, found ${installedTemplate.targetPath}`,
      });

      const manifestPath = path.join(projectRoot, installedTemplate.targetPath, "rendo.template.json");
      if (!(await pathExists(manifestPath))) {
        checks.push({
          name: `installed template ${installedTemplate.id} integration roots`,
          status: "fail",
          detail: `missing template manifest at ${installedTemplate.targetPath}/rendo.template.json`,
        });
        continue;
      }

      const installedManifest = templateManifestSchema.parse(await readJsonFile(manifestPath));
      const missingIntegrationRoots = await verifyDeclaredPaths(
        path.join(projectRoot, installedTemplate.targetPath),
        installedManifest.architecture.rootPaths.integration,
      );
      checks.push({
        name: `installed template ${installedTemplate.id} integration roots`,
        status: missingIntegrationRoots.length === 0 ? "pass" : "fail",
        detail:
          missingIntegrationRoots.length === 0
            ? installedManifest.architecture.rootPaths.integration.join(", ") || "(none)"
            : `missing paths: ${missingIntegrationRoots.join(", ")}`,
      });
    } finally {
      await source.cleanup();
    }
  }

  return {
    cwd,
    projectRoot,
    templateArchitecture: template.architecture,
    checks,
  };
}
