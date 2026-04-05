import { z } from "zod";

export const runtimeModeSchema = z.enum(["source", "managed", "hybrid"]);
export type RuntimeMode = z.infer<typeof runtimeModeSchema>;

export const templateTypeSchema = z.enum(["template"]);
export const templateKindSchema = z.enum([
  "starter-template",
  "feature-template",
  "capability-template",
  "provider-template",
  "surface-template",
]);
export const templateRoleSchema = z.enum(["core", "base", "derived"]);
export const templateCategorySchema = z.string().min(1);

export const uiModeSchema = z.enum(["none", "web", "miniapp", "mobile", "multi"]);
export const surfaceSchema = z.enum(["web", "miniapp", "mobile", "desktop"]);
export const domainTagSchema = z.string().min(1);
export const scenarioTagSchema = z.string().min(1);

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

export const toolchainSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  role: z.string().min(1),
});

export const lineageSchema = z.object({
  coreTemplate: z.string().nullable(),
  baseTemplate: z.string().nullable(),
});

export const surfacePathsSchema = z.record(z.string(), z.array(z.string()));

export const templateManifestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  type: templateTypeSchema,
  templateKind: templateKindSchema,
  templateRole: templateRoleSchema,
  category: templateCategorySchema,
  title: z.string().min(1),
  description: z.string().min(1),
  uiMode: uiModeSchema,
  domainTags: z.array(domainTagSchema).default([]),
  scenarioTags: z.array(scenarioTagSchema).default([]),
  runtimeModes: z.array(runtimeModeSchema).min(1),
  defaultProviders: providerMapSchema,
  recommendedPacks: z.array(z.string()),
  requiredEnv: z.array(z.string()),
  toolchains: z.array(toolchainSchema).default([]),
  lineage: lineageSchema,
  surfaceCapabilities: z.array(surfaceSchema).default([]),
  defaultSurfaces: z.array(surfaceSchema).default([]),
  surfacePaths: surfacePathsSchema.default({}),
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

export const installedTemplateSchema = z.object({
  id: z.string(),
  templateKind: templateKindSchema,
  templateRole: templateRoleSchema,
  targetPath: z.string(),
  installedAt: z.string(),
});

export const projectManifestSchema = z.object({
  schemaVersion: z.string(),
  projectName: z.string(),
  surfaces: z.array(surfaceSchema).default([]),
  template: z.object({
    id: z.string(),
    templateKind: templateKindSchema,
    templateRole: templateRoleSchema,
    version: z.string(),
    runtimeMode: runtimeModeSchema,
    createdFrom: z.string(),
    createdAt: z.string(),
  }),
  installedTemplates: z.array(installedTemplateSchema).default([]),
  installedPacks: z.array(installedPackSchema),
});
export type ProjectManifest = z.infer<typeof projectManifestSchema>;

export const templateRegistryEntrySchema = z.object({
  id: z.string(),
  ref: z.string(),
  aliases: z.array(z.string()),
  official: z.boolean(),
  templateKind: templateKindSchema,
  templateRole: templateRoleSchema,
  manifestPath: z.string(),
  templatePath: z.string(),
});
export type TemplateRegistryEntry = z.infer<typeof templateRegistryEntrySchema>;

export const packRegistryEntrySchema = z.object({
  name: z.string(),
  ref: z.string(),
  aliases: z.array(z.string()),
  official: z.boolean(),
  manifestPath: z.string(),
  filesPath: z.string(),
});
export type PackRegistryEntry = z.infer<typeof packRegistryEntrySchema>;

export const templateRegistrySchema = z.object({
  templates: z.array(templateRegistryEntrySchema),
});

export const packRegistrySchema = z.object({
  packs: z.array(packRegistryEntrySchema),
});

export const inspectPayloadSchema = z.object({
  kind: z.string().min(1),
  id: z.string(),
  title: z.string(),
  version: z.string(),
  type: z.string(),
  templateKind: templateKindSchema.optional(),
  templateRole: templateRoleSchema.optional(),
  description: z.string(),
  category: z.string().optional(),
  uiMode: z.string().optional(),
  domainTags: z.array(domainTagSchema).optional(),
  scenarioTags: z.array(scenarioTagSchema).optional(),
  toolchains: z.array(toolchainSchema).optional(),
  surfaceCapabilities: z.array(surfaceSchema).optional(),
  defaultSurfaces: z.array(surfaceSchema).optional(),
  runtimeModes: z.array(z.string()).optional(),
  runtimeMode: z.string().optional(),
  provider: z.string().optional(),
  requiredEnv: z.array(z.string()),
  dependencies: z.array(z.string()),
  official: z.boolean(),
  install: installPlanSchema.optional(),
});
export type InspectPayload = z.infer<typeof inspectPayloadSchema>;
