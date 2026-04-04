import { z } from "zod";

const envSchema = z.object({
  RENDO_RUNTIME_PORT: z.coerce.number().default(3210),
  RENDO_RUNTIME_MODE: z.enum(["source", "hybrid", "managed"]).default("source"),
  RENDO_PROVIDER_MODE: z.string().default("local-mock"),
  RENDO_API_KEY: z.string().optional(),
});

export function getRuntimeConfig() {
  const parsed = envSchema.parse(process.env);
  return {
    port: parsed.RENDO_RUNTIME_PORT,
    runtimeMode: parsed.RENDO_RUNTIME_MODE,
    providerMode: parsed.RENDO_PROVIDER_MODE,
    apiKeyConfigured: Boolean(parsed.RENDO_API_KEY),
  };
}
