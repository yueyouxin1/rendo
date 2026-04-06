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

export const versionSelectorSchema = z.object({
  min: z.string().min(1).nullable(),
  max: z.string().min(1).nullable(),
});
export type VersionSelector = z.infer<typeof versionSelectorSchema>;

export const lineageSchema = z.object({
  coreTemplate: z.string().nullable(),
  baseTemplate: z.string().nullable(),
});

export const documentationLinksSchema = z.object({
  overview: z.string().min(1),
  structure: z.string().min(1),
  extensionPoints: z.string().min(1),
  inheritanceBoundaries: z.string().min(1),
  secondaryDevelopment: z.string().min(1),
});

export const surfacePathsSchema = z.record(z.string(), z.array(z.string()));

export const hostCompatibilitySchema = z.object({
  templateId: z.string().min(1).nullable(),
  templateKind: templateKindSchema,
  minVersion: z.string().min(1).nullable(),
  maxVersion: z.string().min(1).nullable(),
});
export type HostCompatibility = z.infer<typeof hostCompatibilitySchema>;

export const templateCompatibilitySchema = z.object({
  cli: versionSelectorSchema,
  registryProtocol: versionSelectorSchema,
  hosts: z.array(hostCompatibilitySchema).default([]),
});
export type TemplateCompatibility = z.infer<typeof templateCompatibilitySchema>;

export const templateManifestSchema = z.object({
  schemaVersion: z.string().min(1),
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
  documentation: documentationLinksSchema,
  surfaceCapabilities: z.array(surfaceSchema).default([]),
  defaultSurfaces: z.array(surfaceSchema).default([]),
  surfacePaths: surfacePathsSchema.default({}),
  supports: supportMatrixSchema,
  compatibility: templateCompatibilitySchema,
  assetInstall: z
    .object({
      previewSummary: z.string().min(1),
      supportedHostKinds: z.array(templateKindSchema).default([]),
      supportedHostTemplates: z.array(z.string()).default([]),
      modes: z.array(
        z.object({
          runtimeMode: runtimeModeSchema,
          targetRoot: z.string().min(1),
          conflictStrategy: z.enum(["fail", "overwrite", "skip"]),
          rollbackStrategy: z.enum(["safe-abort", "manual"]),
          install: z.object({
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
          }),
        }),
      ),
    })
    .nullable(),
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
  version: z.string(),
  templateKind: templateKindSchema,
  templateRole: templateRoleSchema,
  runtimeMode: runtimeModeSchema,
  registry: z.string(),
  source: z.enum(["local", "remote"]),
  bundleDigest: z.string().nullable(),
  templateDigest: z.string().nullable(),
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
  documentation: documentationLinksSchema.optional(),
  surfaceCapabilities: z.array(surfaceSchema).optional(),
  defaultSurfaces: z.array(surfaceSchema).optional(),
  runtimeModes: z.array(z.string()).optional(),
  runtimeMode: z.string().optional(),
  provider: z.string().optional(),
  requiredEnv: z.array(z.string()),
  dependencies: z.array(z.string()),
  official: z.boolean(),
  install: installPlanSchema.optional(),
  compatibility: templateCompatibilitySchema.optional(),
  assetInstall: templateManifestSchema.shape.assetInstall.optional(),
});
export type InspectPayload = z.infer<typeof inspectPayloadSchema>;

export const digestSchema = z.object({
  algorithm: z.literal("sha256"),
  value: z.string().min(1),
});
export type Digest = z.infer<typeof digestSchema>;

export const templateBundleFileSchema = z.object({
  path: z.string().min(1),
  encoding: z.literal("base64"),
  sha256: z.string().min(1),
  content: z.string().min(1),
});
export type TemplateBundleFile = z.infer<typeof templateBundleFileSchema>;

export const templateBundleSchema = z.object({
  schemaVersion: z.string().min(1),
  bundleFormat: z.literal("rendo-bundle.v1"),
  templateId: z.string().min(1),
  version: z.string().min(1),
  templateDigest: digestSchema,
  manifest: templateManifestSchema,
  files: z.array(templateBundleFileSchema),
});
export type TemplateBundle = z.infer<typeof templateBundleSchema>;

export const registryAuthSchema = z.object({
  type: z.enum(["none", "bearer-token"]),
  header: z.string().min(1),
  scheme: z.string().min(1).nullable(),
});
export type RegistryAuth = z.infer<typeof registryAuthSchema>;

export const registryHandshakeSchema = z.object({
  schemaVersion: z.string().min(1),
  protocolVersion: z.string().min(1),
  registryId: z.string().min(1),
  registryTitle: z.string().min(1),
  apiBaseUrl: z.string().min(1),
  auth: registryAuthSchema,
  cliCompatibility: versionSelectorSchema,
  bundleFormat: z.literal("rendo-bundle.v1"),
  digestAlgorithm: z.literal("sha256"),
});
export type RegistryHandshake = z.infer<typeof registryHandshakeSchema>;

export const remoteSearchEntrySchema = z.object({
  kind: z.string().min(1),
  id: z.string().min(1),
  title: z.string().min(1),
  version: z.string().min(1),
  category: z.string().min(1),
  templateKind: templateKindSchema.optional(),
  templateRole: templateRoleSchema.optional(),
  official: z.boolean(),
});
export type RemoteSearchEntry = z.infer<typeof remoteSearchEntrySchema>;

export const remoteSearchResponseSchema = z.object({
  registry: z.object({
    id: z.string().min(1),
    protocolVersion: z.string().min(1),
  }),
  results: z.array(remoteSearchEntrySchema),
});
export type RemoteSearchResponse = z.infer<typeof remoteSearchResponseSchema>;

export const remoteInspectResponseSchema = z.object({
  registry: z.object({
    id: z.string().min(1),
    protocolVersion: z.string().min(1),
  }),
  payload: inspectPayloadSchema,
  manifest: templateManifestSchema.optional(),
  bundle: z
    .object({
      url: z.string().min(1),
      digest: digestSchema,
      templateDigest: digestSchema,
      bundleFormat: z.literal("rendo-bundle.v1"),
    })
    .optional(),
});
export type RemoteInspectResponse = z.infer<typeof remoteInspectResponseSchema>;
