import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
export const repoRoot = path.resolve(path.dirname(currentFile), "../../..");

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureMissingOrEmptyDir(targetPath: string): Promise<void> {
  if (!(await pathExists(targetPath))) {
    await ensureDir(targetPath);
    return;
  }

  const entries = await fs.readdir(targetPath);
  if (entries.length > 0) {
    throw new Error(`target directory is not empty: ${targetPath}`);
  }
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isTextFile(filePath: string): boolean {
  const extension = path.extname(filePath).toLowerCase();
  return ![".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf"].includes(extension);
}

export async function walkFiles(rootPath: string): Promise<string[]> {
  const entries = await fs.readdir(rootPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

export async function copyTreeWithReplacements(
  sourceDir: string,
  targetDir: string,
  replacements: Record<string, string>,
): Promise<string[]> {
  const files = await walkFiles(sourceDir);
  const copiedPaths: string[] = [];

  for (const sourceFile of files) {
    const relativePath = path.relative(sourceDir, sourceFile);
    const targetFile = path.join(targetDir, relativePath);
    await ensureDir(path.dirname(targetFile));

    if (isTextFile(sourceFile)) {
      let content = await fs.readFile(sourceFile, "utf8");
      for (const [token, replacement] of Object.entries(replacements)) {
        content = content.replaceAll(token, replacement);
      }
      await fs.writeFile(targetFile, content, "utf8");
    } else {
      await fs.copyFile(sourceFile, targetFile);
    }

    copiedPaths.push(relativePath.replaceAll("\\", "/"));
  }

  return copiedPaths;
}

export async function copyTemplateAsset(sourceDir: string, targetDir: string): Promise<string[]> {
  await ensureMissingOrEmptyDir(targetDir);
  return copyTreeWithReplacements(sourceDir, targetDir, {});
}

export async function appendMissingEnv(filePath: string, envKeys: string[]): Promise<string[]> {
  const existingContent = (await pathExists(filePath)) ? await fs.readFile(filePath, "utf8") : "";
  const existingKeys = new Set(
    existingContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("=", 1)[0]?.trim())
      .filter(Boolean),
  );

  const missing = envKeys.filter((key) => !existingKeys.has(key));
  if (missing.length === 0) {
    return [];
  }

  const lines = [
    existingContent.trimEnd(),
    "",
    "# Added by rendo add",
    ...missing.map((key) => `${key}=`),
  ].filter((line, index) => !(index === 0 && line === ""));

  await fs.writeFile(filePath, `${lines.join("\n")}\n`, "utf8");
  return missing;
}

export function compareVersions(left: string, right: string): number {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  return collator.compare(left, right);
}
