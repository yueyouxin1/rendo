import path from "node:path";
import {
  packManifestSchema,
  packRegistrySchema,
  templateRegistrySchema,
  templateManifestSchema,
  type PackManifest,
  type PackRegistryEntry,
  type TemplateRegistryEntry,
  type TemplateManifest,
} from "./contracts.js";
import { readJsonFile, repoRoot } from "./fs.js";

async function loadRegistryFile<T>(relativePath: string): Promise<T> {
  return readJsonFile<T>(path.join(repoRoot, relativePath));
}

export async function loadTemplateRegistry(): Promise<TemplateRegistryEntry[]> {
  const registry = templateRegistrySchema.parse(await loadRegistryFile("shared/registry/templates.json"));
  return registry.templates;
}

export async function loadPackRegistry(): Promise<PackRegistryEntry[]> {
  const registry = packRegistrySchema.parse(await loadRegistryFile("shared/registry/packs.json"));
  return registry.packs;
}

export async function loadTemplateManifest(entry: TemplateRegistryEntry): Promise<TemplateManifest> {
  return templateManifestSchema.parse(await loadRegistryFile(entry.manifestPath));
}

export async function loadPackManifest(entry: PackRegistryEntry): Promise<PackManifest> {
  return packManifestSchema.parse(await loadRegistryFile(entry.manifestPath));
}

function normalizeRef(ref: string): string {
  const trimmed = ref.trim();
  if (trimmed.startsWith("rendo:")) {
    return trimmed.slice("rendo:".length);
  }

  if (/^https?:\/\//.test(trimmed)) {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? trimmed;
  }

  return trimmed;
}

export async function resolveTemplateRef(ref: string): Promise<TemplateRegistryEntry | null> {
  const registry = await loadTemplateRegistry();
  const normalizedRef = normalizeRef(ref);
  return (
    registry.find((item) =>
      [item.id, item.ref, ...item.aliases].some(
        (candidate) => candidate.toLowerCase() === normalizedRef.toLowerCase(),
      ),
    ) ?? null
  );
}

export async function resolveStarterRef(ref: string): Promise<TemplateRegistryEntry | null> {
  const resolved = await resolveTemplateRef(ref);
  if (!resolved || resolved.templateKind !== "starter-template") {
    return null;
  }
  return resolved;
}

export async function resolvePackRef(ref: string): Promise<PackRegistryEntry | null> {
  const registry = await loadPackRegistry();
  const normalizedRef = normalizeRef(ref);
  return (
    registry.find((item) =>
      [item.name, item.ref, ...item.aliases].some(
        (candidate) => candidate.toLowerCase() === normalizedRef.toLowerCase(),
      ),
    ) ?? null
  );
}

export async function searchRegistry(
  type: string,
  keyword: string,
): Promise<Array<Record<string, string | boolean>>> {
  const normalized = keyword.trim().toLowerCase();
  const results: Array<Record<string, string | boolean>> = [];
  const normalizedType = type.toLowerCase();
  const templateTypeAliases = new Map<string, string>([
    ["starter", "starter-template"],
    ["starter-template", "starter-template"],
    ["feature-template", "feature-template"],
    ["capability-template", "capability-template"],
    ["provider-template", "provider-template"],
    ["surface-template", "surface-template"],
  ]);

  if (normalizedType !== "pack") {
    for (const entry of await loadTemplateRegistry()) {
      const manifest = await loadTemplateManifest(entry);
      if (normalizedType !== "all") {
        const expectedKind = templateTypeAliases.get(normalizedType);
        if (!expectedKind || manifest.templateKind !== expectedKind) {
          continue;
        }
      }

      const haystack = [
        manifest.id,
        manifest.name,
        manifest.title,
        manifest.description,
        ...manifest.domainTags,
        ...manifest.scenarioTags,
      ]
        .join(" ")
        .toLowerCase();
      if (!normalized || haystack.includes(normalized)) {
        results.push({
          kind: manifest.templateKind,
          id: manifest.id,
          title: manifest.title,
          version: manifest.version,
          category: manifest.category,
          templateKind: manifest.templateKind,
          templateRole: manifest.templateRole,
          official: entry.official,
        });
      }
    }
  }

  if (normalizedType === "pack" || normalizedType === "all") {
    for (const entry of await loadPackRegistry()) {
      const manifest = await loadPackManifest(entry);
      const haystack = [manifest.name, manifest.title, manifest.description].join(" ").toLowerCase();
      if (!normalized || haystack.includes(normalized)) {
        results.push({
          kind: "pack",
          id: manifest.name,
          title: manifest.title,
          version: manifest.version,
          category: manifest.type,
          official: entry.official,
        });
      }
    }
  }

  return results;
}
