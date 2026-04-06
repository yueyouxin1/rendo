import { promises as fs } from "node:fs";
import path from "node:path";
import { repoRoot } from "../cli/node/src/fs.js";

const skeletonDir = path.join(repoRoot, "shared/authoring/templates/core/common/skeleton");

const templates = [
  {
    id: "starter-core-template",
    label: "Starter",
    labelLower: "starter templates",
    directory: "starter",
  },
  {
    id: "feature-core-template",
    label: "Feature",
    labelLower: "feature templates",
    directory: "feature",
  },
  {
    id: "capability-core-template",
    label: "Capability",
    labelLower: "capability templates",
    directory: "capability",
  },
  {
    id: "provider-core-template",
    label: "Provider",
    labelLower: "provider templates",
    directory: "provider",
  },
  {
    id: "surface-core-template",
    label: "Surface",
    labelLower: "surface templates",
    directory: "surface",
  },
] as const;

const checkOnly = process.argv.includes("--check");

async function walkFiles(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function renderTemplateFile(sourceFile: string, template: (typeof templates)[number]): Promise<{ relativePath: string; content: string }> {
  const relativePath = path.relative(skeletonDir, sourceFile).replaceAll("\\", "/");
  let content = await fs.readFile(sourceFile, "utf8");
  const replacements: Record<string, string> = {
    "__RENDO_CORE_TEMPLATE_ID__": template.id,
    "__RENDO_CORE_LABEL__": template.label,
    "__RENDO_CORE_LABEL_LOWER__": template.labelLower,
    "__RENDO_CORE_DIRECTORY__": template.directory,
  };

  for (const [token, value] of Object.entries(replacements)) {
    content = content.replaceAll(token, value);
  }

  return {
    relativePath,
    content,
  };
}

async function syncTemplate(template: (typeof templates)[number]) {
  const templateRoot = path.join(repoRoot, "shared/templates/core", template.directory, template.id);
  const renderedFiles: string[] = [];
  const sourceFiles = await walkFiles(skeletonDir);

  for (const sourceFile of sourceFiles) {
    const rendered = await renderTemplateFile(sourceFile, template);
    const targetPath = path.join(templateRoot, rendered.relativePath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    if (checkOnly) {
      const current = await fs.readFile(targetPath, "utf8");
      if (current !== rendered.content) {
        throw new Error(`core template drift detected in ${template.id}: ${rendered.relativePath}`);
      }
    } else {
      await fs.writeFile(targetPath, rendered.content, "utf8");
    }
    renderedFiles.push(rendered.relativePath);
  }

  const kindReadmePath = path.join(templateRoot, template.directory, "README.md");
  const kindReadme = `# ${template.label} Core Notes\n\nThis directory documents the canonical ${template.directory} boundary: keep contracts, extension points, and runtime modes explicit before any base or derived opinion is layered on top.\n`;
  if (checkOnly) {
    const current = await fs.readFile(kindReadmePath, "utf8");
    if (current !== kindReadme) {
      throw new Error(`core template drift detected in ${template.id}: ${template.directory}/README.md`);
    }
  } else {
    await fs.mkdir(path.dirname(kindReadmePath), { recursive: true });
    await fs.writeFile(kindReadmePath, kindReadme, "utf8");
  }
  renderedFiles.push(`${template.directory}/README.md`);

  return {
    templateId: template.id,
    files: renderedFiles,
  };
}

async function main() {
  const results = [];
  for (const template of templates) {
    results.push(await syncTemplate(template));
  }
  console.log(JSON.stringify({ checkOnly, templates: results }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
