import { promises as fs } from "node:fs";
import path from "node:path";
import { createTemplateBundle, serializeTemplateBundle } from "../cli/node/src/bundle.js";
import { ensureDir, readJsonFile, repoRoot, writeJsonFile } from "../cli/node/src/fs.js";
import type { TemplateRegistryEntry } from "../cli/node/src/contracts.js";

async function main() {
  const outputDirArg = process.argv[2];
  if (!outputDirArg) {
    throw new Error("output directory is required, for example: shared/authoring/templates/derived/starter/rendo/rendo-saas-starter/overlay/catalog");
  }

  const excludeArg = process.argv.find((item) => item.startsWith("--exclude="));
  const excluded = new Set(
    (excludeArg?.slice("--exclude=".length) ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

  const outputDir = path.resolve(repoRoot, outputDirArg);
  const bundlesDir = path.join(outputDir, "bundles");
  await fs.rm(outputDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
  await ensureDir(bundlesDir);

  const registry = await readJsonFile<{ templates: TemplateRegistryEntry[] }>(path.join(repoRoot, "shared/registry/templates.json"));
  const entries = registry.templates.filter((entry) => entry.official && !excluded.has(entry.id));

  for (const entry of entries) {
    const templateDir = path.resolve(repoRoot, entry.templatePath);
    const bundle = await createTemplateBundle(templateDir);
    await fs.writeFile(path.join(bundlesDir, `${entry.id}.json`), serializeTemplateBundle(bundle));
  }

  await writeJsonFile(path.join(outputDir, "index.json"), {
    entries: entries.map((entry) => ({
      id: entry.id,
      ref: entry.ref,
      aliases: entry.aliases,
      official: entry.official,
      templateKind: entry.templateKind,
      templateRole: entry.templateRole,
    })),
  });

  console.log(
    JSON.stringify(
      {
        outputDir,
        bundles: entries.length,
        excluded: [...excluded],
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
