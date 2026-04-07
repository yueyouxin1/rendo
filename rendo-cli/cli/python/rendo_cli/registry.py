from __future__ import annotations

from .contracts import validate_pack_manifest, validate_template_manifest
from .assets import resolve_asset_path
from .fs import read_json

TEMPLATE_KIND_ALIASES = {
    "starter": "starter-template",
    "starter-template": "starter-template",
    "feature": "feature-template",
    "feature-template": "feature-template",
    "capability": "capability-template",
    "capability-template": "capability-template",
    "provider": "provider-template",
    "provider-template": "provider-template",
    "surface": "surface-template",
    "surface-template": "surface-template",
}


def _load_registry(relative_path: str) -> dict:
    return read_json(resolve_asset_path(relative_path))


def load_template_registry() -> list[dict]:
    return _load_registry("shared/registry/templates.json")["templates"]


def load_pack_registry() -> list[dict]:
    return _load_registry("shared/registry/packs.json")["packs"]


def load_template_manifest(entry: dict) -> dict:
    return validate_template_manifest(read_json(resolve_asset_path(entry["manifestPath"])))


def load_pack_manifest(entry: dict) -> dict:
    return validate_pack_manifest(read_json(resolve_asset_path(entry["manifestPath"])))


def _normalize_ref(ref: str) -> str:
    text = ref.strip()
    if text.startswith("rendo:"):
        return text[len("rendo:") :]
    if text.startswith("http://") or text.startswith("https://"):
        return text.rstrip("/").split("/")[-1]
    return text


def resolve_template_ref(ref: str) -> dict | None:
    normalized = _normalize_ref(ref).lower()
    for item in load_template_registry():
        candidates = [item["id"], item["ref"], *item["aliases"]]
        if any(candidate.lower() == normalized for candidate in candidates):
            return item
    return None


def resolve_starter_ref(ref: str) -> dict | None:
    resolved = resolve_template_ref(ref)
    if resolved is None or resolved["templateKind"] != "starter-template":
        return None
    return resolved


def resolve_template_kind_alias(value: str) -> str | None:
    return TEMPLATE_KIND_ALIASES.get(value.strip().lower())


def resolve_core_template_ref(ref_or_kind: str) -> dict | None:
    resolved = resolve_template_ref(ref_or_kind)
    if resolved is not None:
        return resolved if resolved["templateRole"] == "core" else None

    kind = resolve_template_kind_alias(ref_or_kind)
    if kind is None:
        return None

    for item in load_template_registry():
        if item["templateKind"] == kind and item["templateRole"] == "core":
            return item
    return None


def resolve_pack_ref(ref: str) -> dict | None:
    normalized = _normalize_ref(ref).lower()
    for item in load_pack_registry():
        candidates = [item["name"], item["ref"], *item["aliases"]]
        if any(candidate.lower() == normalized for candidate in candidates):
            return item
    return None


def search_registry(kind: str, keyword: str) -> list[dict]:
    text = keyword.strip().lower()
    results: list[dict] = []
    normalized_kind = kind.lower()

    if normalized_kind != "pack":
        for entry in load_template_registry():
            manifest = load_template_manifest(entry)
            if normalized_kind != "all":
                expected_kind = resolve_template_kind_alias(normalized_kind)
                if expected_kind is None or manifest["templateKind"] != expected_kind:
                    continue
            haystack = " ".join(
                [manifest["id"], manifest["name"], manifest["title"], manifest["description"], *manifest["domainTags"], *manifest["scenarioTags"]]
            ).lower()
            if not text or text in haystack:
                results.append(
                    {
                        "kind": manifest["templateKind"],
                        "id": manifest["id"],
                        "title": manifest["title"],
                        "version": manifest["version"],
                        "category": manifest["category"],
                        "templateKind": manifest["templateKind"],
                        "templateRole": manifest["templateRole"],
                        "official": entry["official"],
                    }
                )

    if normalized_kind in {"pack", "all"}:
        for entry in load_pack_registry():
            manifest = load_pack_manifest(entry)
            haystack = " ".join([manifest["name"], manifest["title"], manifest["description"]]).lower()
            if not text or text in haystack:
                results.append(
                    {
                        "kind": "pack",
                        "id": manifest["name"],
                        "title": manifest["title"],
                        "version": manifest["version"],
                        "category": manifest["type"],
                        "official": entry["official"],
                    }
                )

    return results
