import { promises as fs } from "node:fs";
import path from "node:path";
import { repoRoot } from "../cli/node/src/fs.js";

const skeletonDir = path.join(repoRoot, "shared/authoring/templates/core/common/skeleton");
const coreAuthoringRoot = path.join(repoRoot, "shared/authoring/templates/core");

const templates = [
  {
    id: "starter-core-template",
    label: "Starter",
    labelLower: "starter templates",
    directory: "starter",
    templateKind: "starter-template",
    runtimeModes: ["source", "managed", "hybrid"],
    hostModel: "host-root",
    runtimeClass: "standalone-runnable",
  },
  {
    id: "feature-core-template",
    label: "Feature",
    labelLower: "feature templates",
    directory: "feature",
    templateKind: "feature-template",
    runtimeModes: ["source", "hybrid"],
    hostModel: "host-attached",
    runtimeClass: "host-attached",
  },
  {
    id: "capability-core-template",
    label: "Capability",
    labelLower: "capability templates",
    directory: "capability",
    templateKind: "capability-template",
    runtimeModes: ["source", "hybrid"],
    hostModel: "host-attached",
    runtimeClass: "host-attached",
  },
  {
    id: "provider-core-template",
    label: "Provider",
    labelLower: "provider templates",
    directory: "provider",
    templateKind: "provider-template",
    runtimeModes: ["source", "hybrid"],
    hostModel: "host-attached",
    runtimeClass: "host-attached",
  },
  {
    id: "surface-core-template",
    label: "Surface",
    labelLower: "surface templates",
    directory: "surface",
    templateKind: "surface-template",
    runtimeModes: ["source", "hybrid"],
    hostModel: "host-attached",
    runtimeClass: "host-attached",
  },
] as const;

const checkOnly = process.argv.includes("--check");

type TemplateConfig = (typeof templates)[number];

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

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function renderContent(content: string, template: TemplateConfig) {
  const replacements: Record<string, string> = {
    "__RENDO_CORE_TEMPLATE_ID__": template.id,
    "__RENDO_CORE_LABEL__": template.label,
    "__RENDO_CORE_LABEL_LOWER__": template.labelLower,
    "__RENDO_CORE_DIRECTORY__": template.directory,
  };

  let rendered = content;
  for (const [token, value] of Object.entries(replacements)) {
    rendered = rendered.replaceAll(token, value);
  }
  return rendered;
}

async function collectRenderedFiles(sourceDir: string, template: TemplateConfig): Promise<Map<string, string>> {
  const renderedFiles = new Map<string, string>();
  if (!(await pathExists(sourceDir))) {
    return renderedFiles;
  }

  const sourceFiles = await walkFiles(sourceDir);
  for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(sourceDir, sourceFile).replaceAll("\\", "/");
    const content = await fs.readFile(sourceFile, "utf8");
    renderedFiles.set(relativePath, renderContent(content, template));
  }
  return renderedFiles;
}

function buildArchitecture(template: TemplateConfig) {
  const shared = {
    agentEntrypoints: [
      "AGENTS.md",
      "CLAUDE.md",
      ".agents/capabilities.yaml",
      ".agents/review-checklist.md",
      ".agents/glossary.md",
    ],
    docs: [
      "docs/structure.md",
      "docs/extension-points.md",
      "docs/inheritance-boundaries.md",
      "docs/secondary-development.md",
    ],
    interfaces: [
      "interfaces/openapi/README.md",
      "interfaces/mcp/README.md",
      "interfaces/skills/README.md",
    ],
    implementation: ["src/README.md"],
    tests: [
      "tests/unit/README.md",
      "tests/contracts/README.md",
      "tests/integration/README.md",
      "tests/smoke/README.md",
      "tests/fixtures/README.md",
    ],
    scripts: ["scripts/health.mjs"],
    integration: ["integration/README.md"],
    operations: [] as string[],
    mounts: [] as string[],
  };

  if (template.directory === "starter") {
    shared.operations = ["ops/README.md"];
    shared.mounts = [
      "src/features/README.md",
      "src/capabilities/README.md",
      "src/providers/README.md",
      "src/surfaces/README.md",
    ];
  }

  return {
    standard: "rendo-service-base.v1",
    hostModel: template.hostModel,
    runtimeClass: template.runtimeClass,
    rootPaths: shared,
  };
}

function buildCoreManifest(template: TemplateConfig) {
  return {
    schemaVersion: "1.0.0",
    id: template.id,
    name: `${template.label} Core Template`,
    version: "0.2.0",
    type: "template",
    templateKind: template.templateKind,
    templateRole: "core",
    category: "core",
    title: `Rendo ${template.label} Core Template`,
    description: `Canonical core substrate for ${template.labelLower} before any base or derived product shape is introduced.`,
    uiMode: "none",
    domainTags: [],
    scenarioTags: [],
    runtimeModes: template.runtimeModes,
    defaultProviders: {
      agent: "none",
      workflow: "none",
      auth: "none",
      db: "none",
      cache: "none",
    },
    recommendedPacks: [],
    requiredEnv: [],
    toolchains: [
      {
        name: "node",
        version: "22",
        role: "runtime",
      },
      {
        name: "npm",
        version: "11",
        role: "package-manager",
      },
    ],
    lineage: {
      coreTemplate: null,
      baseTemplate: null,
      parentTemplate: null,
    },
    documentation: {
      overview: "README.md",
      structure: "docs/structure.md",
      extensionPoints: "docs/extension-points.md",
      inheritanceBoundaries: "docs/inheritance-boundaries.md",
      secondaryDevelopment: "docs/secondary-development.md",
    },
    architecture: buildArchitecture(template),
    surfaceCapabilities: [],
    defaultSurfaces: [],
    surfacePaths: {},
    supports: {
      web: false,
      miniapp: false,
      mobile: false,
      desktop: false,
    },
    compatibility: {
      cli: {
        min: "0.2.0",
        max: null,
      },
      registryProtocol: {
        min: "1.0.0",
        max: null,
      },
      hosts: [],
    },
    assetIntegration: null,
  };
}

async function buildExpectedFiles(template: TemplateConfig) {
  const files = new Map<string, string>();
  for (const [relativePath, content] of await collectRenderedFiles(skeletonDir, template)) {
    files.set(relativePath, content);
  }

  const overlayDir = path.join(coreAuthoringRoot, template.directory, "overlay");
  for (const [relativePath, content] of await collectRenderedFiles(overlayDir, template)) {
    files.set(relativePath, content);
  }

  files.set("rendo.template.json", `${JSON.stringify(buildCoreManifest(template), null, 2)}\n`);
  return files;
}

async function assertDirectoryMatches(templateRoot: string, expectedFiles: Map<string, string>) {
  const existingFiles = await walkFiles(templateRoot);
  const existingRelative = new Set(existingFiles.map((file) => path.relative(templateRoot, file).replaceAll("\\", "/")));
  const expectedRelative = new Set(expectedFiles.keys());

  const unexpected = [...existingRelative].filter((file) => !expectedRelative.has(file)).sort();
  const missing = [...expectedRelative].filter((file) => !existingRelative.has(file)).sort();
  if (unexpected.length > 0 || missing.length > 0) {
    throw new Error(
      `core template drift detected: unexpected=[${unexpected.join(", ")}] missing=[${missing.join(", ")}]`,
    );
  }

  for (const [relativePath, expectedContent] of expectedFiles) {
    const current = await fs.readFile(path.join(templateRoot, relativePath), "utf8");
    if (current !== expectedContent) {
      throw new Error(`core template drift detected: ${relativePath}`);
    }
  }
}

async function writeExpectedFiles(templateRoot: string, expectedFiles: Map<string, string>) {
  await fs.rm(templateRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
  await fs.mkdir(templateRoot, { recursive: true });

  for (const [relativePath, content] of expectedFiles) {
    const targetPath = path.join(templateRoot, relativePath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, content, "utf8");
  }
}

async function syncTemplate(template: TemplateConfig) {
  const templateRoot = path.join(repoRoot, "shared/templates/core", template.directory, template.id);
  const expectedFiles = await buildExpectedFiles(template);

  if (checkOnly) {
    await assertDirectoryMatches(templateRoot, expectedFiles);
  } else {
    await writeExpectedFiles(templateRoot, expectedFiles);
  }

  return {
    templateId: template.id,
    files: [...expectedFiles.keys()].sort(),
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
