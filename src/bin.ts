#!/usr/bin/env node
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Command } from "commander";
import { runDoctor } from "./doctor.js";
import { type InspectPayload, type PackRegistryEntry, type StarterRegistryEntry } from "./contracts.js";
import { installPack, previewPack, upgradePacks } from "./packs.js";
import { findProjectRoot } from "./project.js";
import {
  loadPackManifest,
  loadStarterManifest,
  resolvePackRef,
  resolveStarterRef,
  searchRegistry,
} from "./registry.js";
import { scaffoldStarter } from "./scaffold.js";

function print(value: unknown, json = false): void {
  if (json) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }
  console.log(value);
}

function printInspect(payload: InspectPayload, json: boolean): void {
  if (json) {
    print(payload, true);
    return;
  }

  console.log(`${payload.kind}: ${payload.id}`);
  console.log(`title: ${payload.title}`);
  console.log(`version: ${payload.version}`);
  console.log(`type: ${payload.type}`);
  console.log(`description: ${payload.description}`);
  if (payload.category) {
    console.log(`category: ${payload.category}`);
  }
  if (payload.uiMode) {
    console.log(`ui mode: ${payload.uiMode}`);
  }
  if (payload.runtimeModes) {
    console.log(`runtime modes: ${payload.runtimeModes.join(", ")}`);
  }
  if (payload.runtimeMode) {
    console.log(`runtime mode: ${payload.runtimeMode}`);
  }
  if (payload.provider) {
    console.log(`provider: ${payload.provider}`);
  }
  console.log(`official: ${payload.official ? "yes" : "no"}`);
  console.log(`required env: ${payload.requiredEnv.length ? payload.requiredEnv.join(", ") : "(none)"}`);
  console.log(`dependencies: ${payload.dependencies.length ? payload.dependencies.join(", ") : "(none)"}`);
  if (payload.install) {
    console.log("install plan:");
    console.log(`  adds files: ${payload.install.addsFiles.length ? payload.install.addsFiles.join(", ") : "(none)"}`);
    console.log(
      `  updates files: ${payload.install.updatesFiles.length ? payload.install.updatesFiles.join(", ") : "(none)"}`,
    );
    console.log(`  adds env: ${payload.install.addsEnv.length ? payload.install.addsEnv.join(", ") : "(none)"}`);
    console.log(`  adds routes: ${payload.install.addsRoutes.length ? payload.install.addsRoutes.join(", ") : "(none)"}`);
    console.log(`  adds pages: ${payload.install.addsPages.length ? payload.install.addsPages.join(", ") : "(none)"}`);
    console.log(
      `  adds components: ${
        payload.install.addsComponents.length ? payload.install.addsComponents.join(", ") : "(none)"
      }`,
    );
    console.log(`  adds migrations: ${payload.install.addsMigrations ? "yes" : "no"}`);
    console.log(`  adds worker tasks: ${payload.install.addsWorkerTasks ? "yes" : "no"}`);
    console.log(`  adds admin modules: ${payload.install.addsAdminModules ? "yes" : "no"}`);
    console.log(`  requires manual setup: ${payload.install.requiresManualSetup ? "yes" : "no"}`);
  }
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

async function promptConfirm(question: string): Promise<boolean> {
  const answer = (await prompt(question)).toLowerCase();
  return answer === "y" || answer === "yes";
}

async function resolveCreateArgs(
  first: string | undefined,
  second: string | undefined,
  starterOption: string | undefined,
): Promise<{ starterEntry: StarterRegistryEntry; targetDir: string }> {
  let starterEntry: StarterRegistryEntry | null = null;
  let targetDir: string | undefined;

  if (starterOption) {
    starterEntry = await resolveStarterRef(starterOption);
    targetDir = first;
  } else if (first && second) {
    starterEntry = await resolveStarterRef(first);
    targetDir = second;
  } else if (first) {
    starterEntry = await resolveStarterRef(first);
    if (!starterEntry) {
      targetDir = first;
    }
  }

  if (!starterEntry) {
    const inputRef = await prompt("Starter ref (for example: rendo:hello-world-starter): ");
    starterEntry = await resolveStarterRef(inputRef);
  }

  if (!starterEntry) {
    throw new Error("starter not found in registry");
  }

  if (!targetDir) {
    targetDir = await prompt("Target directory: ");
  }

  if (!targetDir) {
    throw new Error("target directory is required");
  }

  return { starterEntry, targetDir };
}

async function inspectRef(ref: string): Promise<InspectPayload> {
  const starterEntry = await resolveStarterRef(ref);
  if (starterEntry) {
    const manifest = await loadStarterManifest(starterEntry);
    return {
      kind: "starter",
      id: manifest.id,
      title: manifest.title,
      version: manifest.version,
      type: manifest.type,
      description: manifest.description,
      category: manifest.category,
      uiMode: manifest.uiMode,
      runtimeModes: manifest.runtimeModes,
      requiredEnv: manifest.requiredEnv,
      dependencies: manifest.recommendedPacks,
      official: starterEntry.official,
    };
  }

  const packEntry = await resolvePackRef(ref);
  if (packEntry) {
    const manifest = await loadPackManifest(packEntry);
    return {
      kind: "pack",
      id: manifest.name,
      title: manifest.title,
      version: manifest.version,
      type: manifest.type,
      description: manifest.description,
      runtimeMode: manifest.runtimeMode,
      provider: manifest.provider,
      requiredEnv: manifest.requiredEnv,
      dependencies: manifest.dependencies,
      official: packEntry.official,
      install: manifest.install,
    };
  }

  throw new Error(`unable to resolve ref: ${ref}`);
}

async function pullAsset(ref: string, outputDir: string | undefined, json: boolean): Promise<void> {
  const starterEntry = await resolveStarterRef(ref);
  if (starterEntry) {
    const target = path.resolve(outputDir ?? ".rendo-pulled", starterEntry.id);
    const result = await scaffoldStarter(starterEntry, target);
    print({ kind: "starter", ...result }, json);
    return;
  }

  const packEntry = await resolvePackRef(ref);
  if (packEntry) {
    const target = path.resolve(outputDir ?? ".rendo-pulled", packEntry.name);
    const result = await previewPack(packEntry);
    print({ kind: "pack", target, manifest: result }, json);
    return;
  }

  throw new Error(`unable to resolve ref: ${ref}`);
}

async function handleInstall(packEntry: PackRegistryEntry, cwd: string, json: boolean, yes: boolean): Promise<void> {
  const projectRoot = await findProjectRoot(cwd);
  if (!projectRoot) {
    throw new Error("current directory is not inside a rendo project");
  }

  const preview = await previewPack(packEntry);
  if (!json) {
    console.log(`Installing ${preview.name}@${preview.version}`);
    console.log(`runtime mode: ${preview.runtimeMode}`);
    console.log(`required env: ${preview.requiredEnv.join(", ") || "(none)"}`);
    console.log(`adds files: ${preview.install.addsFiles.join(", ") || "(none)"}`);
    console.log(`adds pages: ${preview.install.addsPages.join(", ") || "(none)"}`);
  }

  if (!yes && !(await promptConfirm("Apply this install plan? [y/N] "))) {
    print({ applied: false, preview }, json);
    return;
  }

  const result = await installPack(packEntry, projectRoot);
  print({ applied: true, ...result }, json);
}

async function main(): Promise<void> {
  const program = new Command();
  program.name("rendo").description("Rendo starter and pack control plane").version("0.1.0");

  program
    .command("init")
    .argument("[targetDir]")
    .option("--json", "emit structured output")
    .option("--runtime <mode>", "requested runtime mode", "source")
    .action(async (targetDir: string | undefined, options: { json?: boolean; runtime: string }) => {
      const starterEntry = await resolveStarterRef("core-starter");
      if (!starterEntry) {
        throw new Error("core starter is missing from registry");
      }

      const requestedTarget = targetDir ?? (await prompt("Target directory: "));
      if (!requestedTarget) {
        throw new Error("target directory is required");
      }

      const result = await scaffoldStarter(starterEntry, requestedTarget, options.runtime);
      print(result, Boolean(options.json));
    });

  program
    .command("create")
    .argument("[first]")
    .argument("[second]")
    .option("--starter <ref>", "starter ref")
    .option("--from <url>", "template url")
    .option("--runtime <mode>", "requested runtime mode")
    .option("--json", "emit structured output")
    .action(
      async (
        first: string | undefined,
        second: string | undefined,
        options: { starter?: string; from?: string; runtime?: string; json?: boolean },
      ) => {
        const ref = options.from ?? options.starter;
        const { starterEntry, targetDir } = await resolveCreateArgs(first, second, ref);
        const manifest = await loadStarterManifest(starterEntry);
        if (manifest.type !== "domain-starter") {
          throw new Error(`rendo create only accepts Domain Starters. Use rendo init for ${manifest.id}.`);
        }
        const result = await scaffoldStarter(starterEntry, targetDir, options.runtime);
        print(result, Boolean(options.json));
      },
    );

  program
    .command("search")
    .option("--type <type>", "starter, pack, or all", "all")
    .option("--keyword <keyword>", "keyword search", "")
    .option("--json", "emit structured output")
    .action(async (options: { type: "starter" | "pack" | "all"; keyword: string; json?: boolean }) => {
      const results = await searchRegistry(options.type, options.keyword);
      print(results, Boolean(options.json));
    });

  program
    .command("inspect")
    .argument("<ref>")
    .option("--json", "emit structured output")
    .action(async (ref: string, options: { json?: boolean }) => {
      printInspect(await inspectRef(ref), Boolean(options.json));
    });

  program
    .command("add")
    .argument("<packRef>")
    .option("--yes", "apply without interactive confirmation")
    .option("--json", "emit structured output")
    .action(async (packRef: string, options: { yes?: boolean; json?: boolean }) => {
      const packEntry = await resolvePackRef(packRef);
      if (!packEntry) {
        throw new Error(`pack not found: ${packRef}`);
      }
      await handleInstall(packEntry, process.cwd(), Boolean(options.json), Boolean(options.yes));
    });

  program
    .command("pull")
    .argument("<ref>")
    .option("--output <dir>", "output directory")
    .option("--json", "emit structured output")
    .action(async (ref: string, options: { output?: string; json?: boolean }) => {
      await pullAsset(ref, options.output, Boolean(options.json));
    });

  program
    .command("upgrade")
    .argument("[packRef]")
    .option("--json", "emit structured output")
    .action(async (packRef: string | undefined, options: { json?: boolean }) => {
      const projectRoot = await findProjectRoot(process.cwd());
      if (!projectRoot) {
        throw new Error("current directory is not inside a rendo project");
      }
      const results = await upgradePacks(projectRoot, packRef);
      print(results, Boolean(options.json));
    });

  program
    .command("doctor")
    .option("--json", "emit structured output")
    .action(async (options: { json?: boolean }) => {
      const report = await runDoctor(process.cwd());
      print(report, Boolean(options.json));
    });

  program.configureOutput({
    outputError: (message, write) => write(message),
  });

  await program.parseAsync(process.argv);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`rendo error: ${message}`);
  process.exitCode = 1;
});
