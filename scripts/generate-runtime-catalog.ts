import { promises as fs } from "node:fs";
import path from "node:path";
import { computeBundleDigest, createTemplateBundle, serializeTemplateBundle } from "../cli/node/src/bundle.js";
import { ensureDir, readJsonFile, repoRoot, writeJsonFile } from "../cli/node/src/fs.js";
import type { TemplateRegistryEntry } from "../cli/node/src/contracts.js";
import { CLI_VERSION, REGISTRY_PROTOCOL_VERSION, TEMPLATE_SCHEMA_VERSION } from "../cli/node/src/version.js";

async function main() {
  const outputDirArg = process.argv[2];
  if (!outputDirArg) {
    throw new Error("output directory is required, for example: shared/authoring/templates/derived/starter/rendo/rendo-saas-starter/overlay/catalog");
  }

  const excludeArg = process.argv.find((item) => item.startsWith("--exclude="));
  const apiBaseUrl = process.argv.find((item) => item.startsWith("--api-base-url="))?.slice("--api-base-url=".length) ?? "http://127.0.0.1";
  const excluded = new Set(
    (excludeArg?.slice("--exclude=".length) ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

  const outputDir = path.resolve(repoRoot, outputDirArg);
  const bundlesDir = path.join(outputDir, "bundles");
  const wellKnownDir = path.join(outputDir, ".well-known");
  const snapshotPath = path.join(outputDir, "templates.snapshot.json");
  await fs.rm(outputDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
  await ensureDir(bundlesDir);
  await ensureDir(wellKnownDir);

  const registry = await readJsonFile<{ templates: TemplateRegistryEntry[] }>(path.join(repoRoot, "shared/registry/templates.json"));
  const entries = registry.templates
    .filter((entry) => entry.official && !excluded.has(entry.id))
    .sort((left, right) => left.id.localeCompare(right.id));
  const generatedAt = new Date().toISOString();
  const catalogEntries: Array<Record<string, unknown>> = [];

  for (const entry of entries) {
    const templateDir = path.resolve(repoRoot, entry.templatePath);
    const bundle = await createTemplateBundle(templateDir);
    const rawBundle = serializeTemplateBundle(bundle);
    const bundlePath = path.join(bundlesDir, `${entry.id}.json`);
    await fs.writeFile(bundlePath, rawBundle);
    const manifest = bundle.manifest;
    catalogEntries.push({
      id: entry.id,
      ref: entry.ref,
      aliases: entry.aliases,
      official: entry.official,
      templateKind: entry.templateKind,
      templateRole: entry.templateRole,
      version: manifest.version,
      runtimeModes: manifest.runtimeModes,
      requiredEnv: manifest.requiredEnv,
      toolchains: manifest.toolchains,
      lineage: manifest.lineage,
      architecture: manifest.architecture,
      surfaceCapabilities: manifest.surfaceCapabilities,
      defaultSurfaces: manifest.defaultSurfaces,
      surfacePaths: manifest.surfacePaths,
      supports: manifest.supports,
      compatibility: manifest.compatibility,
      assetIntegration: manifest.assetIntegration,
      artifacts: {
        manifestPath: entry.manifestPath,
        templatePath: entry.templatePath,
        bundlePath: `bundles/${entry.id}.json`,
        bundleDigest: computeBundleDigest(rawBundle),
        templateDigest: bundle.templateDigest,
      },
    });
  }

  const snapshot = {
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    catalogFormat: "rendo-runtime-catalog.v1",
    generatedAt,
    registry: {
      id: "local-official-template-catalog",
      protocolVersion: REGISTRY_PROTOCOL_VERSION,
      bundleFormat: "rendo-bundle.v1",
      digestAlgorithm: "sha256",
    },
    entries: catalogEntries,
  };
  await writeJsonFile(snapshotPath, snapshot);
  await writeJsonFile(path.join(outputDir, "index.json"), snapshot);
  const rawSnapshot = await fs.readFile(snapshotPath);
  const snapshotDigest = computeBundleDigest(rawSnapshot);
  await writeJsonFile(path.join(wellKnownDir, "rendo-registry.json"), {
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    protocolVersion: REGISTRY_PROTOCOL_VERSION,
    registryId: "local-official-template-catalog",
    registryTitle: "Rendo Local Official Template Catalog",
    apiBaseUrl,
    auth: {
      type: "none",
      header: "Authorization",
      scheme: null,
    },
    cliCompatibility: {
      min: CLI_VERSION,
      max: null,
    },
    bundleFormat: "rendo-bundle.v1",
    digestAlgorithm: "sha256",
    snapshot: {
      url: `${apiBaseUrl.replace(/\/+$/, "")}/templates.snapshot.json`,
      digest: snapshotDigest,
    },
  });

  console.log(
    JSON.stringify(
      {
        outputDir,
        bundles: entries.length,
        excluded: [...excluded],
        apiBaseUrl,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
