import { promises as fs } from "node:fs";
import path from "node:path";
import {
  computeBundleDigest,
  computeDirectoryDigest,
  createTemporaryBundleExtraction,
} from "./bundle.js";
import {
  registryHandshakeSchema,
  remoteInspectResponseSchema,
  remoteSearchResponseSchema,
  type InspectPayload,
  type PackManifest,
  type PackRegistryEntry,
  type RegistryHandshake,
  type TemplateManifest,
  type TemplateRegistryEntry,
} from "./contracts.js";
import { compareVersions, pathExists, repoRoot } from "./fs.js";
import {
  loadPackManifest as loadLocalPackManifest,
  loadTemplateManifest as loadLocalTemplateManifest,
  resolveCoreTemplateRef as resolveLocalCoreTemplateRef,
  resolvePackRef as resolveLocalPackRef,
  resolveStarterRef as resolveLocalStarterRef,
  resolveTemplateKindAlias,
  resolveTemplateRef as resolveLocalTemplateRef,
  searchRegistry as searchLocalRegistry,
} from "./registry.js";
import { CLI_VERSION, REGISTRY_PROTOCOL_VERSION, TEMPLATE_SCHEMA_VERSION } from "./version.js";

export type RegistryOptions = {
  registry?: string;
  registryToken?: string;
};

type ResolvedRegistry =
  | {
      source: "local";
      handshake: RegistryHandshake;
    }
  | {
      source: "remote";
      baseUrl: string;
      token?: string;
      handshake: RegistryHandshake;
    };

export type PreparedTemplateSource = {
  manifest: TemplateManifest;
  templateDir: string;
  source: "local" | "remote";
  registry: string;
  bundleDigest: string | null;
  templateDigest: string | null;
  cleanup: () => Promise<void>;
};

export type RegistryInspectResult =
  | {
      source: "local";
      registry: string;
      payload: InspectPayload;
      manifest?: TemplateManifest;
      templateEntry?: TemplateRegistryEntry;
      packEntry?: PackRegistryEntry;
      packManifest?: PackManifest;
    }
  | {
      source: "remote";
      registry: string;
      payload: InspectPayload;
      manifest?: TemplateManifest;
      bundle?: {
        url: string;
        digest: { algorithm: "sha256"; value: string };
        templateDigest: { algorithm: "sha256"; value: string };
        bundleFormat: "rendo-bundle.v1";
      };
    };

function createLocalHandshake(): RegistryHandshake {
  return registryHandshakeSchema.parse({
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    protocolVersion: REGISTRY_PROTOCOL_VERSION,
    registryId: "local-workspace",
    registryTitle: "Rendo Local Workspace Registry",
    apiBaseUrl: "local://workspace",
    auth: {
      type: "none",
      header: "Authorization",
      scheme: null,
    },
    cliCompatibility: {
      min: CLI_VERSION,
      max: null,
    },
    bundleFormat: "rendo-bundle.v1",
    digestAlgorithm: "sha256",
  });
}

function normalizeRegistryInput(registry: string | undefined): string {
  const value = registry?.trim() || process.env.RENDO_REGISTRY_URL?.trim() || "local";
  return value.length > 0 ? value : "local";
}

function matchesVersion(version: string, selector: { min: string | null; max: string | null }): boolean {
  if (selector.min && compareVersions(version, selector.min) < 0) {
    return false;
  }
  if (selector.max && compareVersions(version, selector.max) > 0) {
    return false;
  }
  return true;
}

function buildRemoteHeaders(token: string | undefined): HeadersInit {
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function fetchJson<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(url, {
    headers: buildRemoteHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`remote registry request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

async function resolveRegistry(options?: RegistryOptions): Promise<ResolvedRegistry> {
  const registry = normalizeRegistryInput(options?.registry);
  if (registry === "local") {
    return {
      source: "local",
      handshake: createLocalHandshake(),
    };
  }

  const baseUrl = registry.replace(/\/+$/, "");
  const token = options?.registryToken?.trim() || process.env.RENDO_REGISTRY_TOKEN?.trim();
  const handshake = registryHandshakeSchema.parse(
    await fetchJson<Record<string, unknown>>(`${baseUrl}/.well-known/rendo-registry.json`, token),
  );

  if (!matchesVersion(CLI_VERSION, handshake.cliCompatibility)) {
    throw new Error(
      `cli version ${CLI_VERSION} is not compatible with registry ${handshake.registryId} (${handshake.protocolVersion})`,
    );
  }

  if (!matchesVersion(REGISTRY_PROTOCOL_VERSION, { min: handshake.protocolVersion, max: null })) {
    throw new Error(`registry protocol ${handshake.protocolVersion} is newer than supported ${REGISTRY_PROTOCOL_VERSION}`);
  }

  return {
    source: "remote",
    baseUrl,
    token,
    handshake,
  };
}

function buildInspectPayloadFromTemplate(entry: TemplateRegistryEntry, manifest: TemplateManifest): InspectPayload {
  return {
    kind: manifest.templateKind,
    id: manifest.id,
    title: manifest.title,
    version: manifest.version,
    type: manifest.type,
    templateKind: manifest.templateKind,
    templateRole: manifest.templateRole,
    description: manifest.description,
    category: manifest.category,
    uiMode: manifest.uiMode,
    domainTags: manifest.domainTags,
    scenarioTags: manifest.scenarioTags,
    toolchains: manifest.toolchains,
    surfaceCapabilities: manifest.surfaceCapabilities,
    defaultSurfaces: manifest.defaultSurfaces,
    runtimeModes: manifest.runtimeModes,
    requiredEnv: manifest.requiredEnv,
    dependencies: manifest.recommendedPacks,
    official: entry.official,
    compatibility: manifest.compatibility,
    assetInstall: manifest.assetInstall,
  };
}

function buildInspectPayloadFromPack(entry: PackRegistryEntry, manifest: PackManifest): InspectPayload {
  return {
    kind: "pack",
    id: manifest.name,
    title: manifest.title,
    version: manifest.version,
    type: manifest.type,
    description: manifest.description,
    runtimeMode: manifest.runtimeMode,
    provider: manifest.provider,
    requiredEnv: manifest.requiredEnv,
    dependencies: manifest.dependencies,
    official: entry.official,
    install: manifest.install,
  };
}

export async function getRegistryHandshake(options?: RegistryOptions): Promise<RegistryHandshake> {
  const resolved = await resolveRegistry(options);
  return resolved.handshake;
}

export async function searchRegistry(type: string, keyword: string, options?: RegistryOptions) {
  const resolved = await resolveRegistry(options);
  if (resolved.source === "local") {
    return searchLocalRegistry(type, keyword);
  }

  const payload = remoteSearchResponseSchema.parse(
    await fetchJson<Record<string, unknown>>(
      `${resolved.baseUrl}/v1/search?type=${encodeURIComponent(type)}&keyword=${encodeURIComponent(keyword)}`,
      resolved.token,
    ),
  );
  return payload.results;
}

export async function inspectRegistryRef(ref: string, options?: RegistryOptions): Promise<RegistryInspectResult> {
  const resolved = await resolveRegistry(options);
  if (resolved.source === "local") {
    const templateEntry = await resolveLocalTemplateRef(ref);
    if (templateEntry) {
      const manifest = await loadLocalTemplateManifest(templateEntry);
      return {
        source: "local",
        registry: resolved.handshake.registryId,
        payload: buildInspectPayloadFromTemplate(templateEntry, manifest),
        manifest,
        templateEntry,
      };
    }

    const packEntry = await resolveLocalPackRef(ref);
    if (packEntry) {
      const manifest = await loadLocalPackManifest(packEntry);
      return {
        source: "local",
        registry: resolved.handshake.registryId,
        payload: buildInspectPayloadFromPack(packEntry, manifest),
        packEntry,
        packManifest: manifest,
      };
    }

    throw new Error(`unable to resolve ref: ${ref}`);
  }

  const payload = remoteInspectResponseSchema.parse(
    await fetchJson<Record<string, unknown>>(
      `${resolved.baseUrl}/v1/inspect?ref=${encodeURIComponent(ref)}`,
      resolved.token,
    ),
  );

  return {
    source: "remote",
    registry: payload.registry.id,
    payload: payload.payload,
    manifest: payload.manifest,
    bundle: payload.bundle,
  };
}

async function prepareLocalTemplateSource(entry: TemplateRegistryEntry, registryId: string): Promise<PreparedTemplateSource> {
  const manifest = await loadLocalTemplateManifest(entry);
  const templateDir = path.join(repoRoot, entry.templatePath);
  const templateDigest = await computeDirectoryDigest(templateDir);
  return {
    manifest,
    templateDir,
    source: "local",
    registry: registryId,
    bundleDigest: null,
    templateDigest: templateDigest.value,
    cleanup: async () => {},
  };
}

async function downloadRemoteBundle(url: string, token?: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: buildRemoteHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`remote bundle download failed: ${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function prepareRemoteTemplateSource(
  ref: string,
  resolved: Extract<ResolvedRegistry, { source: "remote" }>,
): Promise<PreparedTemplateSource> {
  const inspected = remoteInspectResponseSchema.parse(
    await fetchJson<Record<string, unknown>>(
      `${resolved.baseUrl}/v1/inspect?ref=${encodeURIComponent(ref)}`,
      resolved.token,
    ),
  );

  if (!inspected.manifest || !inspected.bundle) {
    throw new Error(`remote ref does not expose a template bundle: ${ref}`);
  }

  const bundleUrl = new URL(inspected.bundle.url, resolved.baseUrl).toString();
  const rawBundle = await downloadRemoteBundle(bundleUrl, resolved.token);
  const actualBundleDigest = computeBundleDigest(rawBundle);
  if (actualBundleDigest.value !== inspected.bundle.digest.value) {
    throw new Error(`bundle digest mismatch for ${ref}`);
  }

  const extracted = await createTemporaryBundleExtraction(rawBundle);
  if (extracted.bundle.templateDigest.value !== inspected.bundle.templateDigest.value) {
    await extracted.cleanup();
    throw new Error(`template digest mismatch for ${ref}`);
  }

  return {
    manifest: inspected.manifest,
    templateDir: extracted.templateDir,
    source: "remote",
    registry: inspected.registry.id,
    bundleDigest: actualBundleDigest.value,
    templateDigest: extracted.bundle.templateDigest.value,
    cleanup: extracted.cleanup,
  };
}

export async function prepareTemplateSource(ref: string, options?: RegistryOptions): Promise<PreparedTemplateSource | null> {
  const resolved = await resolveRegistry(options);
  if (resolved.source === "local") {
    const templateEntry = await resolveLocalTemplateRef(ref);
    return templateEntry ? prepareLocalTemplateSource(templateEntry, resolved.handshake.registryId) : null;
  }

  try {
    return await prepareRemoteTemplateSource(ref, resolved);
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return null;
    }
    throw error;
  }
}

export async function prepareCoreTemplateSource(refOrKind: string, options?: RegistryOptions): Promise<PreparedTemplateSource | null> {
  const resolved = await resolveRegistry(options);
  if (resolved.source === "local") {
    const entry = await resolveLocalCoreTemplateRef(refOrKind);
    return entry ? prepareLocalTemplateSource(entry, resolved.handshake.registryId) : null;
  }

  const direct = await prepareTemplateSource(refOrKind, options);
  if (direct?.manifest.templateRole === "core") {
    return direct;
  }
  await direct?.cleanup();

  const kind = resolveTemplateKindAlias(refOrKind);
  if (!kind) {
    return null;
  }

  const results = await searchRegistry(kind, "", options);
  const matched = results.find(
    (item) => item.templateKind === kind && item.templateRole === "core",
  );
  return matched ? prepareTemplateSource(matched.id as string, options) : null;
}

export async function prepareStarterTemplateSource(ref: string, options?: RegistryOptions): Promise<PreparedTemplateSource | null> {
  const prepared = await prepareTemplateSource(ref, options);
  if (!prepared) {
    return null;
  }
  if (prepared.manifest.templateKind !== "starter-template") {
    await prepared.cleanup();
    return null;
  }
  return prepared;
}

export async function resolvePackRef(ref: string, options?: RegistryOptions): Promise<PackRegistryEntry | null> {
  const resolved = await resolveRegistry(options);
  if (resolved.source === "remote") {
    return null;
  }
  return resolveLocalPackRef(ref);
}

export async function loadPackManifest(entry: PackRegistryEntry): Promise<PackManifest> {
  return loadLocalPackManifest(entry);
}

export async function templateBundleExists(source: PreparedTemplateSource): Promise<boolean> {
  return pathExists(path.join(source.templateDir, "rendo.template.json"));
}
