import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");
const template = JSON.parse(fs.readFileSync(path.join(rootDir, "rendo.template.json"), "utf8"));
const project = JSON.parse(fs.readFileSync(path.join(rootDir, "rendo.project.json"), "utf8"));

console.log(
  JSON.stringify(
    {
      ok: true,
      templateId: template.id,
      templateKind: template.templateKind,
      templateRole: template.templateRole,
      createdFrom: project.template.createdFrom,
    },
    null,
    2,
  ),
);

