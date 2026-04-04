import type { RuntimeSnapshot } from "../../contracts/src/index.js";
import { getRuntimeConfig } from "../../config/src/index.js";
import { getProviderDescriptor } from "../../sdk/src/index.js";

export function createRuntimeSnapshot(): RuntimeSnapshot {
  const config = getRuntimeConfig();
  const provider = getProviderDescriptor(config.providerMode);

  return {
    starterId: "hello-world-starter",
    runtimeMode: config.runtimeMode,
    providerMode: provider.mode,
    apiKeyConfigured: config.apiKeyConfigured,
    extensionPoints: [
      "rendo.template.json",
      "rendo.project.json",
      "packages/sdk",
      "packages/domain"
    ],
    greeting: "Hello from the first minimal Rendo Domain Starter."
  };
}
