#!/usr/bin/env node
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Command } from "commander";
import { runDoctor } from "./doctor.js";
import { type InspectPayload, type PackRegistryEntry } from "./contracts.js";
import { copyTemplateAsset } from "./fs.js";
import { installPack, previewPack, upgradePacks } from "./packs.js";
import { findProjectRoot } from "./project.js";
import {
  getRegistryHandshake,
  inspectRegistryRef,
  loadPackManifest,
  prepareCoreTemplateSource,
  prepareStarterTemplateSource,
  prepareTemplateSource,
  resolvePackRef,
  searchRegistry,
  type RegistryOptions,
} from "./registry-client.js";
import { scaffoldTemplate } from "./scaffold.js";
import { installTemplateAsset, previewTemplateAssetInstall, upgradeTemplateAssets } from "./template-assets.js";
import { CLI_VERSION } from "./version.js";

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
  if (payload.compatibility) {
    console.log(
      `compatibility: cli ${payload.compatibility.cli.min ?? "*"}..${payload.compatibility.cli.max ?? "*"}, registry ${payload.compatibility.registryProtocol.min ?? "*"}..${payload.compatibility.registryProtocol.max ?? "*"}`,
    );
  }
  if (payload.assetInstall) {
    console.log(`install summary: ${payload.assetInstall.previewSummary}`);
    console.log(`supported hosts: ${payload.assetInstall.supportedHostTemplates.join(", ") || "(any)"}`);
    for (const mode of payload.assetInstall.modes) {
      console.log(`  mode ${mode.runtimeMode}: target ${mode.targetRoot}, conflict ${mode.conflictStrategy}, rollback ${mode.rollbackStrategy}`);
    }
  }
  if (payload.install) {
    console.log("install plan:");
    console.log(`  adds files: ${payload.install.addsFiles.length ? payload.install.addsFiles.join(", ") : "(none)"}`);
    console.log(`  updates files: ${payload.install.updatesFiles.length ? payload.install.updatesFiles.join(", ") : "(none)"}`);
    console.log(`  adds env: ${payload.install.addsEnv.length ? payload.install.addsEnv.join(", ") : "(none)"}`);
    console.log(`  adds routes: ${payload.install.addsRoutes.length ? payload.install.addsRoutes.join(", ") : "(none)"}`);
    console.log(`  adds pages: ${payload.install.addsPages.length ? payload.install.addsPages.join(", ") : "(none)"}`);
    console.log(
      `  adds components: ${payload.install.addsComponents.length ? payload.install.addsComponents.join(", ") : "(none)"}`,
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

function getRegistryOptions(options: { registry?: string; registryToken?: string }): RegistryOptions {
  return {
    registry: options.registry,
    registryToken: options.registryToken,
  };
}

async function resolveCreateArgs(
  first: string | undefined,
  second: string | undefined,
  starterOption: string | undefined,
  outputOption: string | undefined,
): Promise<{ starterRef: string; targetDir: string }> {
  let starterRef: string | undefined = starterOption;
  let targetDir: string | undefined = outputOption;

  if (!starterRef && first && second) {
    starterRef = first;
    targetDir ??= second;
  } else if (!starterRef && first) {
    starterRef = first;
  }

  if (!starterRef) {
    starterRef = await prompt("Starter ref (for example: rendo:application-base-starter): ");
  }

  return {
    starterRef,
    targetDir: targetDir ?? ".",
  };
}

async function handlePackInstall(packEntry: PackRegistryEntry, cwd: string, json: boolean, yes: boolean): Promise<void> {
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

async function pullTemplateRef(ref: string, outputDir: string | undefined, json: boolean, registryOptions: RegistryOptions): Promise<void> {
  const source = await prepareTemplateSource(ref, registryOptions);
  if (source) {
    try {
      const target = path.resolve(outputDir ?? ".");
      const copiedFiles = await copyTemplateAsset(source.templateDir, target);
      print(
        {
          kind: source.manifest.templateKind,
          templateId: source.manifest.id,
          targetDir: target,
          copiedFiles,
          registry: source.registry,
          source: source.source,
          bundleDigest: source.bundleDigest,
        },
        json,
      );
      return;
    } finally {
      await source.cleanup();
    }
  }

  const packEntry = await resolvePackRef(ref, registryOptions);
  if (packEntry) {
    const result = await previewPack(packEntry);
    print({ kind: "pack", target: path.resolve(outputDir ?? "."), manifest: result }, json);
    return;
  }

  throw new Error(`unable to resolve ref: ${ref}`);
}

async function main(): Promise<void> {
  const program = new Command();
  program
    .name("rendo")
    .description("Rendo starter and template control plane")
    .version(CLI_VERSION)
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  rendo init starter --output my-starter-core",
        "  rendo create application --surfaces web,miniapp --output my-app",
        "  rendo search --type all --json",
        "  rendo inspect llm-provider-base-template --registry http://127.0.0.1:4010 --json",
      ].join("\n"),
    );

  program
    .command("init")
    .description("Initialize a core template in a target directory")
    .argument("<kind>", "starter, feature, capability, provider, or surface")
    .argument("[targetDir]")
    .option("--output <dir>", "output directory")
    .option("--runtime <mode>", "requested runtime mode", "source")
    .option("--registry <provider>", "local or remote registry url", "local")
    .option("--registry-token <token>", "remote registry bearer token")
    .option("--json", "emit structured output")
    .action(async (kind: string, targetDir: string | undefined, options: { json?: boolean; runtime: string; output?: string; registry?: string; registryToken?: string }) => {
      const source = await prepareCoreTemplateSource(kind, getRegistryOptions(options));
      if (!source) {
        throw new Error(`core template is missing from registry for ${kind}`);
      }

      try {
        const requestedTarget = options.output ?? targetDir ?? ".";
        const result = await scaffoldTemplate(source, requestedTarget, options.runtime);
        print({ ...result, registry: source.registry, source: source.source }, Boolean(options.json));
      } finally {
        await source.cleanup();
      }
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
    .option("--registry <provider>", "local or remote registry url", "local")
    .option("--registry-token <token>", "remote registry bearer token")
    .option("--json", "emit structured output")
    .action(
      async (
        first: string | undefined,
        second: string | undefined,
        options: {
          starter?: string;
          from?: string;
          runtime?: string;
          output?: string;
          surfaces?: string;
          json?: boolean;
          registry?: string;
          registryToken?: string;
        },
      ) => {
        const ref = options.from ?? options.starter;
        const { starterRef, targetDir } = await resolveCreateArgs(first, second, ref, options.output);
        const source = await prepareStarterTemplateSource(starterRef, getRegistryOptions(options));
        if (!source) {
          throw new Error("starter not found in registry");
        }

        try {
          if (source.manifest.templateRole === "core") {
            throw new Error(`rendo create does not accept core starter templates. Use rendo init starter for ${source.manifest.id}.`);
          }
          const selectedSurfaces = options.surfaces?.split(",").map((item) => item.trim()).filter(Boolean);
          const result = await scaffoldTemplate(source, targetDir, options.runtime, selectedSurfaces);
          print({ ...result, registry: source.registry, source: source.source }, Boolean(options.json));
        } finally {
          await source.cleanup();
        }
      },
    );

  program
    .command("search")
    .description("Search starter, feature, capability, provider, surface templates, or packs")
    .option("--type <type>", "starter, pack, capability, provider, surface, feature, or all", "all")
    .option("--keyword <keyword>", "keyword search", "")
    .option("--registry <provider>", "local or remote registry url", "local")
    .option("--registry-token <token>", "remote registry bearer token")
    .option("--json", "emit structured output")
    .action(async (options: { type: string; keyword: string; json?: boolean; registry?: string; registryToken?: string }) => {
      const results = await searchRegistry(options.type, options.keyword, getRegistryOptions(options));
      print(results, Boolean(options.json));
    });

  program
    .command("inspect")
    .description("Inspect a template or pack manifest")
    .argument("<ref>")
    .option("--registry <provider>", "local or remote registry url", "local")
    .option("--registry-token <token>", "remote registry bearer token")
    .option("--json", "emit structured output")
    .action(async (ref: string, options: { json?: boolean; registry?: string; registryToken?: string }) => {
      const inspected = await inspectRegistryRef(ref, getRegistryOptions(options));
      printInspect(inspected.payload, Boolean(options.json));
    });

  program
    .command("add")
    .description("Add a non-starter template asset or a pack to the current project")
    .argument("<ref>")
    .option("--preview", "show install plan without applying")
    .option("--yes", "apply without interactive confirmation")
    .option("--registry <provider>", "local or remote registry url", "local")
    .option("--registry-token <token>", "remote registry bearer token")
    .option("--json", "emit structured output")
    .action(async (ref: string, options: { preview?: boolean; yes?: boolean; json?: boolean; registry?: string; registryToken?: string }) => {
      const templateSource = await prepareTemplateSource(ref, getRegistryOptions(options));
      if (templateSource) {
        try {
          if (templateSource.manifest.templateKind === "starter-template") {
            throw new Error(`rendo add does not accept starter templates. Use rendo create for ${templateSource.manifest.id}.`);
          }

          const projectRoot = await findProjectRoot(process.cwd());
          if (!projectRoot) {
            throw new Error("current directory is not inside a rendo project");
          }

          const preview = await previewTemplateAssetInstall(templateSource, projectRoot);
          if (options.preview) {
            print({ applied: false, preview }, Boolean(options.json));
            return;
          }

          const result = await installTemplateAsset(templateSource, projectRoot);
          print({ applied: true, preview, ...result }, Boolean(options.json));
          return;
        } finally {
          await templateSource.cleanup();
        }
      }

      const packEntry = await resolvePackRef(ref, getRegistryOptions(options));
      if (!packEntry) {
        throw new Error(`asset not found: ${ref}`);
      }
      await handlePackInstall(packEntry, process.cwd(), Boolean(options.json), Boolean(options.yes));
    });

  program
    .command("pull")
    .description("Pull a template asset or pack into a local directory")
    .argument("<ref>")
    .option("--output <dir>", "output directory")
    .option("--registry <provider>", "local or remote registry url", "local")
    .option("--registry-token <token>", "remote registry bearer token")
    .option("--json", "emit structured output")
    .action(async (ref: string, options: { output?: string; json?: boolean; registry?: string; registryToken?: string }) => {
      await pullTemplateRef(ref, options.output, Boolean(options.json), getRegistryOptions(options));
    });

  program
    .command("upgrade")
    .description("Upgrade installed template assets or packs in the current project")
    .argument("[ref]")
    .option("--preview", "show upgrade plans without applying")
    .option("--registry <provider>", "local or remote registry url", "local")
    .option("--registry-token <token>", "remote registry bearer token")
    .option("--json", "emit structured output")
    .action(async (ref: string | undefined, options: { preview?: boolean; json?: boolean; registry?: string; registryToken?: string }) => {
      const projectRoot = await findProjectRoot(process.cwd());
      if (!projectRoot) {
        throw new Error("current directory is not inside a rendo project");
      }

      const templateResults = await upgradeTemplateAssets(projectRoot, {
        ...getRegistryOptions(options),
        templateRef: ref,
        preview: Boolean(options.preview),
      }).catch((error) => {
        if (error instanceof Error && error.message.startsWith("template is not installed")) {
          return [];
        }
        if (error instanceof Error && error.message === "no template assets installed in project") {
          return [];
        }
        throw error;
      });

      if (templateResults.length > 0) {
        print(templateResults, Boolean(options.json));
        return;
      }

      const results = await upgradePacks(projectRoot, ref);
      print(results, Boolean(options.json));
    });

  program
    .command("doctor")
    .description("Diagnose local tooling, registry connectivity, and current project state")
    .option("--registry <provider>", "local or remote registry url", "local")
    .option("--registry-token <token>", "remote registry bearer token")
    .option("--json", "emit structured output")
    .action(async (options: { json?: boolean; registry?: string; registryToken?: string }) => {
      const report = await runDoctor(process.cwd());
      const registry = await getRegistryHandshake(getRegistryOptions(options));
      print({ ...report, registry }, Boolean(options.json));
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
