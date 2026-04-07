import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
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
import { ensureDir, pathExists, readJsonFile, walkFiles, writeJsonFile } from "./fs.js";
import { loadProjectState } from "./project.js";
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

function normalizeRelativePath(relativePath: string): string {
  return relativePath.replaceAll("\\", "/");
}

function gitIgnoreCandidates(files: string[]): string[] {
  return files.filter((file) => !file.startsWith(".git/") && !file.startsWith(".rendo/"));
}

function shouldForceIncludeWorkspaceFile(relativePath: string): boolean {
  return relativePath === ".rendo/rendo.project.json" || relativePath === ".rendo/rendo.template.json";
}

function escapeRegex(value: string): string {
  return value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

function patternToRegex(pattern: string, directoryOnly: boolean): RegExp {
  const anchored = pattern.startsWith("/");
  const normalizedPattern = anchored ? pattern.slice(1) : pattern;
  let source = "";
  for (let index = 0; index < normalizedPattern.length; index += 1) {
    const char = normalizedPattern[index];
    const next = normalizedPattern[index + 1];
    if (char === "*") {
      if (next === "*") {
        source += ".*";
        index += 1;
      } else {
        source += "[^/]*";
      }
      continue;
    }
    if (char === "?") {
      source += "[^/]";
      continue;
    }
    source += escapeRegex(char);
  }

  if (!normalizedPattern.includes("/")) {
    source = `(^|.*/)${source}`;
  } else if (!anchored) {
    source = `(^|.*/)${source}`;
  } else {
    source = `^${source}`;
  }

  const suffix = directoryOnly ? "(?:/.*)?$" : "$";
  return new RegExp(source.endsWith("$") ? source : `${source}${suffix}`);
}

async function resolveIgnoredWorkspaceFiles(rootDir: string, relativePaths: string[]): Promise<Set<string>> {
  const candidates = gitIgnoreCandidates(relativePaths);
  if (candidates.length === 0 || !(await pathExists(path.join(rootDir, ".gitignore")))) {
    return new Set();
  }

  const git = spawnSync("git", ["check-ignore", "--no-index", "-z", "--stdin"], {
    cwd: rootDir,
    input: `${candidates.join("\0")}\0`,
    encoding: "utf8",
    windowsHide: true,
  });

  if (git.status === 0 || git.status === 1) {
    return new Set(git.stdout.split("\0").filter(Boolean));
  }

  const patterns = (await fs.readFile(path.join(rootDir, ".gitignore"), "utf8"))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const negated = line.startsWith("!");
      const rawPattern = negated ? line.slice(1) : line;
      const directoryOnly = rawPattern.endsWith("/");
      return {
        negated,
        regex: patternToRegex(directoryOnly ? rawPattern.slice(0, -1) : rawPattern, directoryOnly),
      };
    });

  const ignored = new Set<string>();
  for (const relativePath of candidates) {
    let matched = false;
    for (const pattern of patterns) {
      if (pattern.regex.test(relativePath)) {
        matched = !pattern.negated;
      }
    }
    if (matched) {
      ignored.add(relativePath);
    }
  }
  return ignored;
}

async function loadBundleFiles(
  templateDir: string,
  options?: { includeRelativePath?: (relativePath: string) => boolean },
): Promise<LoadedBundleFile[]> {
  const files = (await walkFiles(templateDir)).sort((left, right) => comparePaths(left, right));
  const loaded: LoadedBundleFile[] = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath);
    const relativePath = normalizeRelativePath(path.relative(templateDir, filePath));
    if (options?.includeRelativePath && !options.includeRelativePath(relativePath)) {
      continue;
    }
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

export async function createWorkspacePublishBundle(projectRoot: string): Promise<TemplateBundle> {
  const { template } = await loadProjectState(projectRoot);
  const allFiles = (await walkFiles(projectRoot))
    .map((filePath) => normalizeRelativePath(path.relative(projectRoot, filePath)))
    .filter((relativePath) => !relativePath.startsWith(".git/"));
  const ignoredFiles = await resolveIgnoredWorkspaceFiles(projectRoot, allFiles);
  const files = await loadBundleFiles(projectRoot, {
    includeRelativePath: (relativePath) => shouldForceIncludeWorkspaceFile(relativePath) || !ignoredFiles.has(relativePath),
  });
  const bundleFiles: TemplateBundleFile[] = files.map((item) => ({
    path: item.path,
    encoding: "base64",
    sha256: item.sha256,
    content: item.content.toString("base64"),
  }));

  return templateBundleSchema.parse({
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    bundleFormat: "rendo-bundle.v1",
    templateId: template.id,
    version: template.version,
    templateDigest: computeTemplateDigest(files),
    manifest: template,
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
