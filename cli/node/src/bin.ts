#!/usr/bin/env node
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Command } from "commander";
import { runDoctor } from "./doctor.js";
import { type InspectPayload, type PackRegistryEntry, type TemplateRegistryEntry } from "./contracts.js";
import { installPack, previewPack, upgradePacks } from "./packs.js";
import { findProjectRoot } from "./project.js";
import { copyTemplateAsset } from "./fs.js";
import { installTemplateAsset } from "./template-assets.js";
import {
  loadPackManifest,
  loadTemplateManifest,
  resolveCoreTemplateRef,
  resolvePackRef,
  resolveStarterRef,
  resolveTemplateRef,
  searchRegistry,
} from "./registry.js";
import { scaffoldTemplate } from "./scaffold.js";

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
  if (payload.templateKind) {
    console.log(`template kind: ${payload.templateKind}`);
  }
  if (payload.templateRole) {
    console.log(`template role: ${payload.templateRole}`);
  }
  console.log(`description: ${payload.description}`);
  if (payload.category) {
    console.log(`category: ${payload.category}`);
  }
  if (payload.uiMode) {
    console.log(`ui mode: ${payload.uiMode}`);
  }
  if (payload.domainTags?.length) {
    console.log(`domain tags: ${payload.domainTags.join(", ")}`);
  }
  if (payload.scenarioTags?.length) {
    console.log(`scenario tags: ${payload.scenarioTags.join(", ")}`);
  }
  if (payload.toolchains?.length) {
    console.log(`toolchains: ${payload.toolchains.map((item) => `${item.name}@${item.version} (${item.role})`).join(", ")}`);
  }
  if (payload.surfaceCapabilities?.length) {
    console.log(`surface capabilities: ${payload.surfaceCapabilities.join(", ")}`);
  }
  if (payload.defaultSurfaces?.length) {
    console.log(`default surfaces: ${payload.defaultSurfaces.join(", ")}`);
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
  outputOption: string | undefined,
): Promise<{ starterEntry: TemplateRegistryEntry; targetDir: string }> {
  let starterEntry: TemplateRegistryEntry | null = null;
  let targetDir: string | undefined = outputOption;

  if (starterOption) {
    starterEntry = await resolveStarterRef(starterOption);
    targetDir ??= first;
  } else if (first && second) {
    starterEntry = await resolveStarterRef(first);
    targetDir ??= second;
  } else if (first) {
    starterEntry = await resolveStarterRef(first);
    if (!starterEntry) {
      targetDir ??= first;
    }
  }

  if (!starterEntry) {
    const inputRef = await prompt("Starter ref (for example: rendo:application-base-starter): ");
    starterEntry = await resolveStarterRef(inputRef);
  }

  if (!starterEntry) {
    throw new Error("starter not found in registry");
  }

  targetDir ||= ".";

  return { starterEntry, targetDir };
}

async function inspectRef(ref: string): Promise<InspectPayload> {
  const templateEntry = await resolveTemplateRef(ref);
  if (templateEntry) {
    const manifest = await loadTemplateManifest(templateEntry);
    return {
      kind: manifest.templateKind,
      id: manifest.id,
      title: manifest.title,
      version: manifest.version,
      type: manifest.type,
      templateKind: manifest.templateKind,
      templateRole: manifest.templateRole,
      description: manifest.description,
      category: manifest.category,
      uiMode: manifest.uiMode,
      domainTags: manifest.domainTags,
      scenarioTags: manifest.scenarioTags,
      toolchains: manifest.toolchains,
      surfaceCapabilities: manifest.surfaceCapabilities,
      defaultSurfaces: manifest.defaultSurfaces,
      runtimeModes: manifest.runtimeModes,
      requiredEnv: manifest.requiredEnv,
      dependencies: manifest.recommendedPacks,
      official: templateEntry.official,
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
  const templateEntry = await resolveTemplateRef(ref);
  if (templateEntry) {
    const target = path.resolve(outputDir ?? ".");
    const copiedFiles = await copyTemplateAsset(path.resolve(templateEntry.templatePath), target);
    print({ kind: templateEntry.templateKind, templateId: templateEntry.id, targetDir: target, copiedFiles }, json);
    return;
  }

  const packEntry = await resolvePackRef(ref);
  if (packEntry) {
    const target = path.resolve(outputDir ?? ".");
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
  program
    .name("rendo")
    .description("Rendo starter and template control plane")
    .version("0.1.0")
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  rendo init starter --output my-starter-core",
        "  rendo init capability --output my-capability-core",
        "  rendo create application --surfaces web,miniapp --output my-app",
        "  rendo inspect llm-provider-base-template --json",
        "  rendo pull admin-surface-base-template --output ./admin-surface",
      ].join("\n"),
    );

  program
    .command("init")
    .description("Initialize a core template in a target directory")
    .argument("<kind>", "starter, feature, capability, provider, or surface")
    .argument("[targetDir]")
    .option("--output <dir>", "output directory")
    .option("--json", "emit structured output")
    .option("--runtime <mode>", "requested runtime mode", "source")
    .action(async (kind: string, targetDir: string | undefined, options: { json?: boolean; runtime: string; output?: string }) => {
      const templateEntry = await resolveCoreTemplateRef(kind);
      if (!templateEntry) {
        throw new Error(`core template is missing from registry for ${kind}`);
      }

      const requestedTarget = options.output ?? targetDir ?? ".";

      const result = await scaffoldTemplate(templateEntry, requestedTarget, options.runtime);
      print(result, Boolean(options.json));
    });

  program
    .command("create")
    .description("Create a project from a Starter Template")
    .argument("[first]")
    .argument("[second]")
    .option("--starter <ref>", "starter ref")
    .option("--from <url>", "template url")
    .option("--runtime <mode>", "requested runtime mode")
    .option("--output <dir>", "output directory")
    .option("--surfaces <surfaces>", "comma-separated surfaces to generate")
    .option("--json", "emit structured output")
    .action(
      async (
        first: string | undefined,
        second: string | undefined,
        options: { starter?: string; from?: string; runtime?: string; output?: string; surfaces?: string; json?: boolean },
      ) => {
        const ref = options.from ?? options.starter;
        const { starterEntry, targetDir } = await resolveCreateArgs(first, second, ref, options.output);
        const manifest = await loadTemplateManifest(starterEntry);
        if (manifest.templateKind !== "starter-template") {
          throw new Error(`rendo create only accepts starter templates. Use rendo add or rendo pull for ${manifest.id}.`);
        }
        if (manifest.templateRole === "core") {
          throw new Error(`rendo create does not accept core starter templates. Use rendo init starter for ${manifest.id}.`);
        }
        const selectedSurfaces = options.surfaces?.split(",").map((item) => item.trim()).filter(Boolean);
        const result = await scaffoldTemplate(starterEntry, targetDir, options.runtime, selectedSurfaces);
        print(result, Boolean(options.json));
      },
    );

  program
    .command("search")
    .description("Search starter, feature, capability, provider, surface templates, or packs")
    .option("--type <type>", "starter, pack, or all", "all")
    .option("--keyword <keyword>", "keyword search", "")
    .option("--json", "emit structured output")
    .action(async (options: { type: string; keyword: string; json?: boolean }) => {
      const results = await searchRegistry(options.type, options.keyword);
      print(results, Boolean(options.json));
    });

  program
    .command("inspect")
    .description("Inspect a template or pack manifest")
    .argument("<ref>")
    .option("--json", "emit structured output")
    .action(async (ref: string, options: { json?: boolean }) => {
      printInspect(await inspectRef(ref), Boolean(options.json));
    });

  program
    .command("add")
    .description("Add a pack to the current project")
    .argument("<packRef>")
    .option("--yes", "apply without interactive confirmation")
    .option("--json", "emit structured output")
    .action(async (packRef: string, options: { yes?: boolean; json?: boolean }) => {
      const templateEntry = await resolveTemplateRef(packRef);
      if (templateEntry && templateEntry.templateKind !== "starter-template") {
        const projectRoot = await findProjectRoot(process.cwd());
        if (!projectRoot) {
          throw new Error("current directory is not inside a rendo project");
        }
        const result = await installTemplateAsset(templateEntry, projectRoot);
        print({ applied: true, ...result }, Boolean(options.json));
        return;
      }

      const packEntry = await resolvePackRef(packRef);
      if (!packEntry) {
        throw new Error(`pack not found: ${packRef}`);
      }
      await handleInstall(packEntry, process.cwd(), Boolean(options.json), Boolean(options.yes));
    });

  program
    .command("pull")
    .description("Pull a template asset or pack into a local directory")
    .argument("<ref>")
    .option("--output <dir>", "output directory")
    .option("--json", "emit structured output")
    .action(async (ref: string, options: { output?: string; json?: boolean }) => {
      await pullAsset(ref, options.output, Boolean(options.json));
    });

  program
    .command("upgrade")
    .description("Upgrade installed packs in the current project")
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
    .description("Diagnose local tooling and current project state")
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
