from __future__ import annotations


RUNTIME_MODES = {"source", "managed", "hybrid"}
TEMPLATE_TYPES = {"template"}
TEMPLATE_KINDS = {"starter-template", "feature-template", "capability-template", "provider-template", "surface-template"}
TEMPLATE_ROLES = {"core", "base", "derived"}
SURFACES = {"web", "miniapp", "mobile", "desktop"}


def require_keys(payload: dict, keys: list[str], label: str) -> None:
    missing = [key for key in keys if key not in payload]
    if missing:
        raise RuntimeError(f"{label} is missing required keys: {', '.join(missing)}")


def validate_template_manifest(payload: dict) -> dict:
    require_keys(
        payload,
        [
            "id",
            "name",
            "version",
            "type",
            "templateKind",
            "templateRole",
            "category",
            "title",
            "description",
            "uiMode",
            "domainTags",
            "scenarioTags",
            "runtimeModes",
            "defaultProviders",
            "recommendedPacks",
            "requiredEnv",
            "toolchains",
            "lineage",
            "surfaceCapabilities",
            "defaultSurfaces",
            "surfacePaths",
            "supports",
        ],
        "template manifest",
    )
    if payload["type"] not in TEMPLATE_TYPES:
        raise RuntimeError(f"invalid template type: {payload['type']}")
    if payload["templateKind"] not in TEMPLATE_KINDS:
        raise RuntimeError(f"invalid template kind: {payload['templateKind']}")
    if payload["templateRole"] not in TEMPLATE_ROLES:
        raise RuntimeError(f"invalid template role: {payload['templateRole']}")
    if any(mode not in RUNTIME_MODES for mode in payload["runtimeModes"]):
        raise RuntimeError("invalid runtime mode in template manifest")
    if any(surface not in SURFACES for surface in payload["surfaceCapabilities"]):
        raise RuntimeError("invalid surface in template manifest")
    if any(surface not in SURFACES for surface in payload["defaultSurfaces"]):
        raise RuntimeError("invalid default surface in template manifest")
    return payload


def validate_project_manifest(payload: dict) -> dict:
    require_keys(payload, ["schemaVersion", "projectName", "surfaces", "template", "installedTemplates", "installedPacks"], "project manifest")
    require_keys(
        payload["template"],
        ["id", "templateKind", "templateRole", "version", "runtimeMode", "createdFrom", "createdAt"],
        "project template",
    )
    return payload


def validate_pack_manifest(payload: dict) -> dict:
    require_keys(
        payload,
        [
            "name",
            "version",
            "title",
            "type",
            "runtimeMode",
            "provider",
            "description",
            "dependencies",
            "requiredEnv",
            "permissions",
            "billing",
            "install",
        ],
        "pack manifest",
    )
    if payload["runtimeMode"] not in RUNTIME_MODES:
        raise RuntimeError(f"invalid pack runtime mode: {payload['runtimeMode']}")
    return payload
