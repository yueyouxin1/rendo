from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from urllib import parse, request

from .bundle import compute_bundle_digest, compute_directory_digest, create_temporary_bundle_extraction
from .contracts import (
    validate_pack_manifest,
    validate_registry_handshake,
    validate_remote_inspect_response,
    validate_remote_search_response,
    validate_template_manifest,
)
from .fs import REPO_ROOT, compare_versions, read_json
from .registry import (
    load_pack_manifest as load_local_pack_manifest,
    load_template_manifest as load_local_template_manifest,
    resolve_core_template_ref as resolve_local_core_template_ref,
    resolve_pack_ref as resolve_local_pack_ref,
    resolve_template_kind_alias,
    resolve_template_ref as resolve_local_template_ref,
    search_registry as search_local_registry,
)
from .version import CLI_VERSION, REGISTRY_PROTOCOL_VERSION, TEMPLATE_SCHEMA_VERSION


def _create_local_handshake() -> dict:
    return validate_registry_handshake(
        {
            "schemaVersion": TEMPLATE_SCHEMA_VERSION,
            "protocolVersion": REGISTRY_PROTOCOL_VERSION,
            "registryId": "local-workspace",
            "registryTitle": "Rendo Local Workspace Registry",
            "apiBaseUrl": "local://workspace",
            "auth": {
                "type": "none",
                "header": "Authorization",
                "scheme": None,
            },
            "cliCompatibility": {
                "min": CLI_VERSION,
                "max": None,
            },
            "bundleFormat": "rendo-bundle.v1",
            "digestAlgorithm": "sha256",
        }
    )


def _normalize_registry_input(registry: str | None) -> str:
    value = (registry or "").strip()
    if value:
        return value
    from_env = __import__("os").environ.get("RENDO_REGISTRY_URL", "").strip()
    return from_env or "local"


def _matches_version(version: str, selector: dict) -> bool:
    minimum = selector.get("min")
    maximum = selector.get("max")
    if minimum and compare_versions(version, minimum) < 0:
        return False
    if maximum and compare_versions(version, maximum) > 0:
        return False
    return True


def _fetch_json(url: str, token: str | None = None) -> dict:
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    response = request.urlopen(request.Request(url, headers=headers), timeout=30)
    return json.loads(response.read().decode("utf-8"))


def _download_bytes(url: str, token: str | None = None) -> bytes:
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    response = request.urlopen(request.Request(url, headers=headers), timeout=30)
    return response.read()


def _resolve_registry(options: dict | None = None) -> dict:
    registry = _normalize_registry_input(options.get("registry") if options else None)
    token = (options.get("registryToken") if options else None) or __import__("os").environ.get("RENDO_REGISTRY_TOKEN")
    if registry == "local":
        return {
            "source": "local",
            "handshake": _create_local_handshake(),
        }

    base_url = registry.rstrip("/")
    handshake = validate_registry_handshake(_fetch_json(f"{base_url}/.well-known/rendo-registry.json", token))
    if not _matches_version(CLI_VERSION, handshake["cliCompatibility"]):
        raise RuntimeError(
            f"cli version {CLI_VERSION} is not compatible with registry {handshake['registryId']} ({handshake['protocolVersion']})"
        )
    if not _matches_version(REGISTRY_PROTOCOL_VERSION, {"min": handshake["protocolVersion"], "max": None}):
        raise RuntimeError(
            f"registry protocol {handshake['protocolVersion']} is newer than supported {REGISTRY_PROTOCOL_VERSION}"
        )
    return {
        "source": "remote",
        "baseUrl": base_url,
        "token": token,
        "handshake": handshake,
    }


def _build_template_payload(entry: dict, manifest: dict) -> dict:
    return {
        "kind": manifest["templateKind"],
        "id": manifest["id"],
        "title": manifest["title"],
        "version": manifest["version"],
        "type": manifest["type"],
        "templateKind": manifest["templateKind"],
        "templateRole": manifest["templateRole"],
        "description": manifest["description"],
        "category": manifest["category"],
        "uiMode": manifest["uiMode"],
        "domainTags": manifest["domainTags"],
        "scenarioTags": manifest["scenarioTags"],
        "toolchains": manifest["toolchains"],
        "surfaceCapabilities": manifest["surfaceCapabilities"],
        "defaultSurfaces": manifest["defaultSurfaces"],
        "runtimeModes": manifest["runtimeModes"],
        "requiredEnv": manifest["requiredEnv"],
        "dependencies": manifest["recommendedPacks"],
        "official": entry["official"],
        "compatibility": manifest["compatibility"],
        "assetInstall": manifest["assetInstall"],
    }


def _build_pack_payload(entry: dict, manifest: dict) -> dict:
    return {
        "kind": "pack",
        "id": manifest["name"],
        "title": manifest["title"],
        "version": manifest["version"],
        "type": manifest["type"],
        "description": manifest["description"],
        "runtimeMode": manifest["runtimeMode"],
        "provider": manifest["provider"],
        "requiredEnv": manifest["requiredEnv"],
        "dependencies": manifest["dependencies"],
        "official": entry["official"],
        "install": manifest["install"],
    }


def get_registry_handshake(options: dict | None = None) -> dict:
    return _resolve_registry(options)["handshake"]


def search_registry(type_name: str, keyword: str, options: dict | None = None) -> list[dict]:
    resolved = _resolve_registry(options)
    if resolved["source"] == "local":
        return search_local_registry(type_name, keyword)

    payload = validate_remote_search_response(
        _fetch_json(
            f"{resolved['baseUrl']}/v1/search?type={parse.quote(type_name)}&keyword={parse.quote(keyword)}",
            resolved["token"],
        )
    )
    return payload["results"]


def inspect_registry_ref(ref: str, options: dict | None = None) -> dict:
    resolved = _resolve_registry(options)
    if resolved["source"] == "local":
        template_entry = resolve_local_template_ref(ref)
        if template_entry:
            manifest = load_local_template_manifest(template_entry)
            return {
                "source": "local",
                "registry": resolved["handshake"]["registryId"],
                "payload": _build_template_payload(template_entry, manifest),
                "manifest": manifest,
                "templateEntry": template_entry,
            }
        pack_entry = resolve_local_pack_ref(ref)
        if pack_entry:
            manifest = validate_pack_manifest(load_local_pack_manifest(pack_entry))
            return {
                "source": "local",
                "registry": resolved["handshake"]["registryId"],
                "payload": _build_pack_payload(pack_entry, manifest),
                "packEntry": pack_entry,
                "packManifest": manifest,
            }
        raise RuntimeError(f"unable to resolve ref: {ref}")

    payload = validate_remote_inspect_response(
        _fetch_json(f"{resolved['baseUrl']}/v1/inspect?ref={parse.quote(ref)}", resolved["token"])
    )
    return {
        "source": "remote",
        "registry": payload["registry"]["id"],
        "payload": payload["payload"],
        "manifest": payload.get("manifest"),
        "bundle": payload.get("bundle"),
    }


def _prepare_local_template_source(entry: dict, registry_id: str) -> dict:
    manifest = load_local_template_manifest(entry)
    template_dir = REPO_ROOT / entry["templatePath"]
    template_digest = compute_directory_digest(template_dir)
    return {
        "manifest": manifest,
        "templateDir": template_dir,
        "source": "local",
        "registry": registry_id,
        "bundleDigest": None,
        "templateDigest": template_digest["value"],
        "cleanup": lambda: None,
    }


def _prepare_remote_template_source(ref: str, resolved: dict) -> dict:
    inspected = validate_remote_inspect_response(
        _fetch_json(f"{resolved['baseUrl']}/v1/inspect?ref={parse.quote(ref)}", resolved["token"])
    )
    if "manifest" not in inspected or "bundle" not in inspected:
        raise RuntimeError(f"remote ref does not expose a template bundle: {ref}")

    bundle_url = parse.urljoin(resolved["baseUrl"] + "/", inspected["bundle"]["url"])
    raw_bundle = _download_bytes(bundle_url, resolved["token"])
    actual_bundle_digest = compute_bundle_digest(raw_bundle)
    if actual_bundle_digest["value"] != inspected["bundle"]["digest"]["value"]:
        raise RuntimeError(f"bundle digest mismatch for {ref}")

    extracted = create_temporary_bundle_extraction(raw_bundle)
    if extracted["bundle"]["templateDigest"]["value"] != inspected["bundle"]["templateDigest"]["value"]:
        extracted["cleanup"]()
        raise RuntimeError(f"template digest mismatch for {ref}")

    return {
        "manifest": inspected["manifest"],
        "templateDir": extracted["templateDir"],
        "source": "remote",
        "registry": inspected["registry"]["id"],
        "bundleDigest": actual_bundle_digest["value"],
        "templateDigest": extracted["bundle"]["templateDigest"]["value"],
        "cleanup": extracted["cleanup"],
    }


def prepare_template_source(ref: str, options: dict | None = None) -> dict | None:
    resolved = _resolve_registry(options)
    if resolved["source"] == "local":
        entry = resolve_local_template_ref(ref)
        return _prepare_local_template_source(entry, resolved["handshake"]["registryId"]) if entry else None
    return _prepare_remote_template_source(ref, resolved)


def prepare_core_template_source(ref_or_kind: str, options: dict | None = None) -> dict | None:
    resolved = _resolve_registry(options)
    if resolved["source"] == "local":
        entry = resolve_local_core_template_ref(ref_or_kind)
        return _prepare_local_template_source(entry, resolved["handshake"]["registryId"]) if entry else None

    direct = prepare_template_source(ref_or_kind, options)
    if direct and direct["manifest"]["templateRole"] == "core":
        return direct
    if direct:
        direct["cleanup"]()

    kind = resolve_template_kind_alias(ref_or_kind)
    if kind is None:
        return None
    results = search_registry(kind, "", options)
    matched = next(
        (item for item in results if item.get("templateKind") == kind and item.get("templateRole") == "core"),
        None,
    )
    return prepare_template_source(matched["id"], options) if matched else None


def prepare_starter_template_source(ref: str, options: dict | None = None) -> dict | None:
    prepared = prepare_template_source(ref, options)
    if prepared is None:
        return None
    if prepared["manifest"]["templateKind"] != "starter-template":
        prepared["cleanup"]()
        return None
    return prepared


def resolve_pack_ref(ref: str, options: dict | None = None) -> dict | None:
    resolved = _resolve_registry(options)
    if resolved["source"] == "remote":
        return None
    return resolve_local_pack_ref(ref)


def load_pack_manifest(entry: dict) -> dict:
    return load_local_pack_manifest(entry)
