import { promises as fs } from "node:fs";
import path from "node:path";
import {
  projectManifestSchema,
  templateManifestSchema,
  type ProjectManifest,
  type TemplateManifest,
} from "./contracts.js";
import { pathExists, readJsonFile, writeJsonFile } from "./fs.js";

export async function findProjectRoot(startDir: string): Promise<string | null> {
  let current = path.resolve(startDir);

  while (true) {
    const projectManifest = path.join(current, "rendo.project.json");
    const templateManifest = path.join(current, "rendo.template.json");
    if ((await pathExists(projectManifest)) && (await pathExists(templateManifest))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

export async function loadProjectState(projectRoot: string): Promise<{
  project: ProjectManifest;
  template: TemplateManifest;
}> {
  const project = projectManifestSchema.parse(await readJsonFile<ProjectManifest>(path.join(projectRoot, "rendo.project.json")));
  const template = templateManifestSchema.parse(
    await readJsonFile<TemplateManifest>(path.join(projectRoot, "rendo.template.json")),
  );
  return { project, template };
}

export async function saveProjectManifest(projectRoot: string, manifest: ProjectManifest): Promise<void> {
  await writeJsonFile(path.join(projectRoot, "rendo.project.json"), manifest);
}

export async function readEnvKeys(envFilePath: string): Promise<Set<string>> {
  if (!(await pathExists(envFilePath))) {
    return new Set();
  }

  const content = await fs.readFile(envFilePath, "utf8");
  return new Set(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("=", 1)[0]?.trim())
      .filter(Boolean),
  );
}
