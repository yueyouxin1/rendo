import path from "node:path";
import {
  packManifestSchema,
  packRegistrySchema,
  starterRegistrySchema,
  templateManifestSchema,
  type PackManifest,
  type PackRegistryEntry,
  type StarterRegistryEntry,
  type TemplateManifest,
} from "./contracts.js";
import { readJsonFile, repoRoot } from "./fs.js";

async function loadRegistryFile<T>(relativePath: string): Promise<T> {
  return readJsonFile<T>(path.join(repoRoot, relativePath));
}

export async function loadStarterRegistry(): Promise<StarterRegistryEntry[]> {
  const registry = starterRegistrySchema.parse(await loadRegistryFile("registry/starters.json"));
  return registry.starters;
}

export async function loadPackRegistry(): Promise<PackRegistryEntry[]> {
  const registry = packRegistrySchema.parse(await loadRegistryFile("registry/packs.json"));
  return registry.packs;
}

export async function loadStarterManifest(entry: StarterRegistryEntry): Promise<TemplateManifest> {
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

export async function resolveStarterRef(ref: string): Promise<StarterRegistryEntry | null> {
  const registry = await loadStarterRegistry();
  const normalizedRef = normalizeRef(ref);
  return (
    registry.find((item) =>
      [item.id, item.ref, ...item.aliases].some(
        (candidate) => candidate.toLowerCase() === normalizedRef.toLowerCase(),
      ),
    ) ?? null
  );
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
  type: "starter" | "pack" | "all",
  keyword: string,
): Promise<Array<Record<string, string | boolean>>> {
  const normalized = keyword.trim().toLowerCase();
  const results: Array<Record<string, string | boolean>> = [];

  if (type === "starter" || type === "all") {
    for (const entry of await loadStarterRegistry()) {
      const manifest = await loadStarterManifest(entry);
      const haystack = [manifest.id, manifest.name, manifest.title, manifest.description].join(" ").toLowerCase();
      if (!normalized || haystack.includes(normalized)) {
        results.push({
          kind: "starter",
          id: manifest.id,
          title: manifest.title,
          version: manifest.version,
          category: manifest.category,
          official: entry.official,
        });
      }
    }
  }

  if (type === "pack" || type === "all") {
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
