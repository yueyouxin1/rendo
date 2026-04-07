import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  runtimeModeSchema,
  templateKindSchema,
  templateManifestSchema,
  templateRoleSchema,
} from "../../cli/node/src/contracts.js";
import { copyTreeWithReplacements, ensureDir, repoRoot, walkFiles } from "../../cli/node/src/fs.js";

const templateProfileSchema = z.object({
  profileId: z.string().min(1),
  templateId: z.string().min(1),
  templateKind: templateKindSchema,
  templateRole: templateRoleSchema,
  category: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  baseTemplatePath: z.string().min(1),
  outputTemplatePath: z.string().min(1),
  overlayPath: z.string().min(1),
  removePaths: z.array(z.string()).default([]),
});

const templateProjectManifestSchema = z.object({
  schemaVersion: z.string().min(1),
  projectName: z.string().min(1),
  surfaces: z.array(z.string()),
  template: z.object({
    id: z.string().min(1),
    templateKind: z.union([templateKindSchema, z.literal("__RENDO_TEMPLATE_KIND__")]),
    templateRole: z.union([templateRoleSchema, z.literal("__RENDO_TEMPLATE_ROLE__")]),
    version: z.string().min(1),
    runtimeMode: z.union([runtimeModeSchema, z.literal("__RENDO_RUNTIME_MODE__")]),
    createdFrom: z.string().min(1),
    createdAt: z.string().min(1),
  }),
  installedTemplates: z.array(z.unknown()),
  installedPacks: z.array(z.unknown()),
});

export type TemplateProfile = z.infer<typeof templateProfileSchema>;

async function readProfile(profilePath: string): Promise<TemplateProfile> {
  const content = await fs.readFile(profilePath, "utf8");
  return templateProfileSchema.parse(JSON.parse(content));
}

async function copyOverlay(overlayDir: string, targetDir: string): Promise<string[]> {
  try {
    await fs.access(overlayDir);
  } catch {
    return [];
  }

  return copyTreeWithReplacements(overlayDir, targetDir, {});
}

async function removeInheritedPaths(outputDir: string, removePaths: string[]): Promise<void> {
  for (const relativePath of removePaths) {
    await fs.rm(path.join(outputDir, relativePath), { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
  }
}

async function validateGeneratedTemplate(profile: TemplateProfile, outputDir: string): Promise<void> {
  const template = templateManifestSchema.parse(
    JSON.parse(await fs.readFile(path.join(outputDir, "rendo.template.json"), "utf8")),
  );
  const project = templateProjectManifestSchema.parse(
    JSON.parse(await fs.readFile(path.join(outputDir, "rendo.project.json"), "utf8")),
  );

  if (template.id !== profile.templateId) {
    throw new Error(`generated template id mismatch: expected ${profile.templateId}, got ${template.id}`);
  }

  if (template.type !== "template") {
    throw new Error(`generated template must use type=template, got ${template.type}`);
  }

  if (template.templateKind !== profile.templateKind) {
    throw new Error(`generated template kind mismatch: expected ${profile.templateKind}, got ${template.templateKind}`);
  }

  if (template.templateRole !== profile.templateRole) {
    throw new Error(`generated template role mismatch: expected ${profile.templateRole}, got ${template.templateRole}`);
  }

  if (template.category !== profile.category) {
    throw new Error(`generated template category mismatch: expected ${profile.category}, got ${template.category}`);
  }

  if (project.template.createdFrom !== `rendo:${profile.templateId}`) {
    throw new Error(`generated project manifest must point at rendo:${profile.templateId}`);
  }
}

export async function generateTemplateFromProfile(profilePathRelativeToRepo: string) {
  const profilePath = path.join(repoRoot, profilePathRelativeToRepo);
  const profile = await readProfile(profilePath);
  const baseDir = path.join(repoRoot, profile.baseTemplatePath);
  const outputDir = path.join(repoRoot, profile.outputTemplatePath);
  const overlayDir = path.join(repoRoot, profile.overlayPath);

  await fs.rm(outputDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
  await ensureDir(outputDir);

  const baseFiles = await copyTreeWithReplacements(baseDir, outputDir, {});
  await removeInheritedPaths(outputDir, profile.removePaths);
  const overlayFiles = await copyOverlay(overlayDir, outputDir);

  await validateGeneratedTemplate(profile, outputDir);

  const generatedFiles = await walkFiles(outputDir);
  return {
    profileId: profile.profileId,
    templateId: profile.templateId,
    outputDir,
    baseFiles,
    removedPaths: profile.removePaths,
    overlayFiles,
    generatedFiles: generatedFiles.length,
  };
}
