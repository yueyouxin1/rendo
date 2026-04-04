export type RuntimeMode = "source" | "hybrid" | "managed";

export type RuntimeSnapshot = {
  starterId: string;
  runtimeMode: RuntimeMode;
  providerMode: string;
  apiKeyConfigured: boolean;
  extensionPoints: string[];
  greeting: string;
};
