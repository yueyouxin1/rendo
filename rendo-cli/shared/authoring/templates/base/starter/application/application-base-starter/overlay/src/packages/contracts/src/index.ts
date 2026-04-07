export type ApplicationSurface = "web" | "miniapp" | "mobile";

export type ApplicationRuntimeMode = "source";

export type ApplicationAssetRoot = "features" | "capabilities" | "providers" | "surfaces";

export interface ApplicationStarterIdentity {
  templateId: "application-base-starter";
  runtimeMode: ApplicationRuntimeMode;
  surfaces: ApplicationSurface[];
}
