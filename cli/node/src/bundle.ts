import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  type Digest,
  templateBundleSchema,
  type TemplateBundle,
  type TemplateBundleFile,
  type TemplateManifest,
} from "./contracts.js";
import { ensureDir, readJsonFile, walkFiles, writeJsonFile } from "./fs.js";
import { TEMPLATE_SCHEMA_VERSION } from "./version.js";

function sha256Hex(content: Buffer | string): string {
  return createHash("sha256").update(content).digest("hex");
}

function comparePaths(left: string, right: string): number {
  if (left === right) {
    return 0;
  }
  return left < right ? -1 : 1;
}

type LoadedBundleFile = {
  path: string;
  content: Buffer;
  sha256: string;
};

async function loadBundleFiles(templateDir: string): Promise<LoadedBundleFile[]> {
  const files = (await walkFiles(templateDir)).sort((left, right) => comparePaths(left, right));
  const loaded: LoadedBundleFile[] = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath);
    const relativePath = path.relative(templateDir, filePath).replaceAll("\\", "/");
    loaded.push({
      path: relativePath,
      content,
      sha256: sha256Hex(content),
    });
  }

  return loaded;
}

function computeTemplateDigest(files: Array<Pick<LoadedBundleFile, "path" | "sha256">>): Digest {
  const payload = files
    .slice()
    .sort((left, right) => comparePaths(left.path, right.path))
    .map((item) => `${item.path}\n${item.sha256}`)
    .join("\n");

  return {
    algorithm: "sha256",
    value: sha256Hex(payload),
  };
}

export async function computeDirectoryDigest(templateDir: string): Promise<Digest> {
  const files = await loadBundleFiles(templateDir);
  return computeTemplateDigest(files);
}

export async function createTemplateBundle(templateDir: string): Promise<TemplateBundle> {
  const manifest = await readJsonFile<TemplateManifest>(path.join(templateDir, "rendo.template.json"));
  const files = await loadBundleFiles(templateDir);
  const bundleFiles: TemplateBundleFile[] = files.map((item) => ({
    path: item.path,
    encoding: "base64",
    sha256: item.sha256,
    content: item.content.toString("base64"),
  }));

  return templateBundleSchema.parse({
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    bundleFormat: "rendo-bundle.v1",
    templateId: manifest.id,
    version: manifest.version,
    templateDigest: computeTemplateDigest(files),
    manifest,
    files: bundleFiles,
  });
}

export function serializeTemplateBundle(bundle: TemplateBundle): Buffer {
  return Buffer.from(`${JSON.stringify(bundle, null, 2)}\n`, "utf8");
}

export function computeBundleDigest(rawBundle: Buffer): Digest {
  return {
    algorithm: "sha256",
    value: sha256Hex(rawBundle),
  };
}

export function parseTemplateBundle(rawBundle: Buffer): { bundle: TemplateBundle; bundleDigest: Digest } {
  const bundle = templateBundleSchema.parse(JSON.parse(rawBundle.toString("utf8")));
  return {
    bundle,
    bundleDigest: computeBundleDigest(rawBundle),
  };
}

export async function extractTemplateBundle(bundle: TemplateBundle, targetDir: string): Promise<string[]> {
  await ensureDir(targetDir);
  const writtenFiles: string[] = [];

  for (const file of bundle.files) {
    const outputPath = path.join(targetDir, file.path);
    await ensureDir(path.dirname(outputPath));
    const content = Buffer.from(file.content, "base64");
    if (sha256Hex(content) !== file.sha256) {
      throw new Error(`bundle file digest mismatch: ${file.path}`);
    }
    await fs.writeFile(outputPath, content);
    writtenFiles.push(file.path);
  }

  return writtenFiles;
}

export async function createTemporaryBundleExtraction(rawBundle: Buffer): Promise<{
  bundle: TemplateBundle;
  templateDir: string;
  bundleDigest: Digest;
  cleanup: () => Promise<void>;
}> {
  const { bundle, bundleDigest } = parseTemplateBundle(rawBundle);
  const templateDir = await fs.mkdtemp(path.join(os.tmpdir(), "rendo-template-bundle-"));

  await extractTemplateBundle(bundle, templateDir);
  await writeJsonFile(path.join(templateDir, "rendo.template.json"), bundle.manifest);

  return {
    bundle,
    templateDir,
    bundleDigest,
    cleanup: async () => {
      await fs.rm(templateDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
    },
  };
}
