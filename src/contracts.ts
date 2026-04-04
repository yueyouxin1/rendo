import { z } from "zod";

export const runtimeModeSchema = z.enum(["source", "managed", "hybrid"]);
export type RuntimeMode = z.infer<typeof runtimeModeSchema>;

export const templateTypeSchema = z.enum(["core-starter", "domain-starter"]);
export const templateCategorySchema = z.enum([
  "core",
  "web-app",
  "saas",
  "ai-webapp",
  "headless-agent",
  "workflow-service",
  "internal-tool",
]);

export const uiModeSchema = z.enum(["none", "web", "miniapp", "mobile", "multi"]);

export const supportMatrixSchema = z.object({
  web: z.boolean(),
  miniapp: z.boolean(),
  mobile: z.boolean(),
  desktop: z.boolean(),
});

export const providerMapSchema = z.object({
  agent: z.string(),
  workflow: z.string(),
  auth: z.string(),
  db: z.string(),
  cache: z.string(),
});

export const templateManifestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  type: templateTypeSchema,
  category: templateCategorySchema,
  title: z.string().min(1),
  description: z.string().min(1),
  uiMode: uiModeSchema,
  runtimeModes: z.array(runtimeModeSchema).min(1),
  defaultProviders: providerMapSchema,
  recommendedPacks: z.array(z.string()),
  requiredEnv: z.array(z.string()),
  supports: supportMatrixSchema,
});
export type TemplateManifest = z.infer<typeof templateManifestSchema>;

export const packTypeSchema = z.enum([
  "tool-pack",
  "workflow-pack",
  "workflow-node-pack",
  "channel-pack",
  "admin-pack",
  "data-pack",
  "agent-pack",
]);

export const installPlanSchema = z.object({
  addsFiles: z.array(z.string()),
  updatesFiles: z.array(z.string()),
  deletesFiles: z.array(z.string()),
  addsEnv: z.array(z.string()),
  addsRoutes: z.array(z.string()),
  addsPages: z.array(z.string()),
  addsComponents: z.array(z.string()),
  addsMigrations: z.boolean(),
  addsWorkerTasks: z.boolean(),
  addsAdminModules: z.boolean(),
  requiresManualSetup: z.boolean(),
});
export type InstallPlan = z.infer<typeof installPlanSchema>;

export const packManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  title: z.string().min(1),
  type: packTypeSchema,
  runtimeMode: runtimeModeSchema,
  provider: z.enum(["rendo", "community", "third-party"]),
  description: z.string().min(1),
  dependencies: z.array(z.string()),
  requiredEnv: z.array(z.string()),
  permissions: z.array(z.string()),
  billing: z.object({
    mode: z.string().min(1),
  }),
  install: installPlanSchema,
  official: z.boolean().default(false),
  appliesTo: z.array(z.string()).default([]),
});
export type PackManifest = z.infer<typeof packManifestSchema>;

export const installedPackSchema = z.object({
  name: z.string(),
  version: z.string(),
  runtimeMode: runtimeModeSchema,
  provider: z.string(),
  installedAt: z.string(),
});

export const projectManifestSchema = z.object({
  schemaVersion: z.string(),
  projectName: z.string(),
  starter: z.object({
    id: z.string(),
    version: z.string(),
    runtimeMode: runtimeModeSchema,
    createdFrom: z.string(),
    createdAt: z.string(),
  }),
  installedPacks: z.array(installedPackSchema),
});
export type ProjectManifest = z.infer<typeof projectManifestSchema>;

export const starterRegistryEntrySchema = z.object({
  id: z.string(),
  ref: z.string(),
  aliases: z.array(z.string()),
  official: z.boolean(),
  manifestPath: z.string(),
  templatePath: z.string(),
});
export type StarterRegistryEntry = z.infer<typeof starterRegistryEntrySchema>;

export const packRegistryEntrySchema = z.object({
  name: z.string(),
  ref: z.string(),
  aliases: z.array(z.string()),
  official: z.boolean(),
  manifestPath: z.string(),
  filesPath: z.string(),
});
export type PackRegistryEntry = z.infer<typeof packRegistryEntrySchema>;

export const starterRegistrySchema = z.object({
  starters: z.array(starterRegistryEntrySchema),
});

export const packRegistrySchema = z.object({
  packs: z.array(packRegistryEntrySchema),
});

export const inspectPayloadSchema = z.object({
  kind: z.enum(["starter", "pack"]),
  id: z.string(),
  title: z.string(),
  version: z.string(),
  type: z.string(),
  description: z.string(),
  category: z.string().optional(),
  uiMode: z.string().optional(),
  runtimeModes: z.array(z.string()).optional(),
  runtimeMode: z.string().optional(),
  provider: z.string().optional(),
  requiredEnv: z.array(z.string()),
  dependencies: z.array(z.string()),
  official: z.boolean(),
  install: installPlanSchema.optional(),
});
export type InspectPayload = z.infer<typeof inspectPayloadSchema>;
