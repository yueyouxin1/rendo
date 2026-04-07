import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");

function readJsonWithFallback(...candidatePaths) {
  for (const candidatePath of candidatePaths) {
    if (fs.existsSync(candidatePath)) {
      return {
        path: candidatePath,
        value: JSON.parse(fs.readFileSync(candidatePath, "utf8")),
      };
    }
  }

  throw new Error(`Missing metadata file. Checked: ${candidatePaths.join(", ")}`);
}

const workspaceMetadataDir = path.join(rootDir, ".rendo");
const templateMetadata = readJsonWithFallback(
  path.join(workspaceMetadataDir, "rendo.template.json"),
  path.join(rootDir, "rendo.template.json"),
);
const projectMetadata = readJsonWithFallback(
  path.join(workspaceMetadataDir, "rendo.project.json"),
  path.join(rootDir, "rendo.project.json"),
);
const template = templateMetadata.value;
const project = projectMetadata.value;

console.log(
  JSON.stringify(
    {
      ok: true,
      templateId: template.id,
      templateKind: template.templateKind,
      templateRole: template.templateRole,
      createdFrom: project.template.createdFrom,
      metadataSource: {
        template: path.relative(rootDir, templateMetadata.path),
        project: path.relative(rootDir, projectMetadata.path),
      },
    },
    null,
    2,
  ),
);
