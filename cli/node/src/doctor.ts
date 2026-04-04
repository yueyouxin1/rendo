import { spawnSync } from "node:child_process";
import path from "node:path";
import { findProjectRoot, loadProjectState, readEnvKeys } from "./project.js";
import { loadPackManifest, resolvePackRef } from "./registry.js";

type CheckStatus = "pass" | "warn" | "fail";

type Check = {
  name: string;
  status: CheckStatus;
  detail: string;
};

function runCommand(command: string, args: string[]): Check {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status === 0) {
    return {
      name: `${command} ${args.join(" ")}`.trim(),
      status: "pass",
      detail: result.stdout.trim() || result.stderr.trim() || "ok",
    };
  }

  return {
    name: `${command} ${args.join(" ")}`.trim(),
    status: "fail",
    detail: result.stderr.trim() || result.stdout.trim() || "command not available",
  };
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

  return { cwd, projectRoot, checks };
}
