from __future__ import annotations


RUNTIME_MODES = {"source", "managed", "hybrid"}
TEMPLATE_TYPES = {"template"}
TEMPLATE_KINDS = {"starter-template", "feature-template", "capability-template", "provider-template", "surface-template"}
TEMPLATE_ROLES = {"core", "base", "derived"}
SURFACES = {"web", "miniapp", "mobile", "desktop"}
CONFLICT_STRATEGIES = {"fail", "overwrite", "skip"}
ROLLBACK_STRATEGIES = {"safe-abort", "manual"}
AUTH_TYPES = {"none", "bearer-token"}


def require_keys(payload: dict, keys: list[str], label: str) -> None:
    missing = [key for key in keys if key not in payload]
    if missing:
        raise RuntimeError(f"{label} is missing required keys: {', '.join(missing)}")


def validate_version_selector(payload: dict, label: str) -> dict:
    require_keys(payload, ["min", "max"], label)
    return payload


def validate_install_plan(payload: dict, label: str = "install plan") -> dict:
    require_keys(
        payload,
        [
            "addsFiles",
            "updatesFiles",
            "deletesFiles",
            "addsEnv",
            "addsRoutes",
            "addsPages",
            "addsComponents",
            "addsMigrations",
            "addsWorkerTasks",
            "addsAdminModules",
            "requiresManualSetup",
        ],
        label,
    )
    return payload


def validate_template_compatibility(payload: dict) -> dict:
    require_keys(payload, ["cli", "registryProtocol", "hosts"], "template compatibility")
    validate_version_selector(payload["cli"], "template compatibility cli")
    validate_version_selector(payload["registryProtocol"], "template compatibility registryProtocol")
    for host in payload["hosts"]:
        require_keys(host, ["templateId", "templateKind", "minVersion", "maxVersion"], "template host compatibility")
        if host["templateKind"] not in TEMPLATE_KINDS:
            raise RuntimeError(f"invalid host template kind: {host['templateKind']}")
        if host["templateId"] is not None and not isinstance(host["templateId"], str):
            raise RuntimeError("invalid host template id")
    return payload


def validate_asset_install(payload: dict | None) -> dict | None:
    if payload is None:
        return None

    require_keys(payload, ["previewSummary", "supportedHostKinds", "supportedHostTemplates", "modes"], "asset install")
    if any(kind not in TEMPLATE_KINDS for kind in payload["supportedHostKinds"]):
        raise RuntimeError("invalid supported host kind in asset install")
    for mode in payload["modes"]:
        require_keys(
            mode,
            ["runtimeMode", "targetRoot", "conflictStrategy", "rollbackStrategy", "install"],
            "asset install mode",
        )
        if mode["runtimeMode"] not in RUNTIME_MODES:
            raise RuntimeError(f"invalid asset install runtime mode: {mode['runtimeMode']}")
        if mode["conflictStrategy"] not in CONFLICT_STRATEGIES:
            raise RuntimeError(f"invalid conflict strategy: {mode['conflictStrategy']}")
        if mode["rollbackStrategy"] not in ROLLBACK_STRATEGIES:
            raise RuntimeError(f"invalid rollback strategy: {mode['rollbackStrategy']}")
        validate_install_plan(mode["install"], "asset install mode plan")
    return payload


def validate_template_manifest(payload: dict) -> dict:
    require_keys(
        payload,
        [
            "schemaVersion",
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
            "documentation",
            "surfaceCapabilities",
            "defaultSurfaces",
            "surfacePaths",
            "supports",
            "compatibility",
            "assetInstall",
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
    require_keys(
        payload["documentation"],
        ["overview", "structure", "extensionPoints", "inheritanceBoundaries", "secondaryDevelopment"],
        "template documentation",
    )
    if any(surface not in SURFACES for surface in payload["surfaceCapabilities"]):
        raise RuntimeError("invalid surface in template manifest")
    if any(surface not in SURFACES for surface in payload["defaultSurfaces"]):
        raise RuntimeError("invalid default surface in template manifest")
    validate_template_compatibility(payload["compatibility"])
    validate_asset_install(payload["assetInstall"])
    return payload


def validate_project_manifest(payload: dict) -> dict:
    require_keys(payload, ["schemaVersion", "projectName", "surfaces", "template", "installedTemplates", "installedPacks"], "project manifest")
    require_keys(
        payload["template"],
        ["id", "templateKind", "templateRole", "version", "runtimeMode", "createdFrom", "createdAt"],
        "project template",
    )
    for item in payload["installedTemplates"]:
        require_keys(
            item,
            [
                "id",
                "version",
                "templateKind",
                "templateRole",
                "runtimeMode",
                "registry",
                "source",
                "bundleDigest",
                "templateDigest",
                "targetPath",
                "installedAt",
            ],
            "installed template",
        )
        if item["templateKind"] not in TEMPLATE_KINDS:
            raise RuntimeError(f"invalid installed template kind: {item['templateKind']}")
        if item["templateRole"] not in TEMPLATE_ROLES:
            raise RuntimeError(f"invalid installed template role: {item['templateRole']}")
        if item["runtimeMode"] not in RUNTIME_MODES:
            raise RuntimeError(f"invalid installed template runtime mode: {item['runtimeMode']}")
        if item["source"] not in {"local", "remote"}:
            raise RuntimeError(f"invalid installed template source: {item['source']}")
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
    validate_install_plan(payload["install"])
    return payload


def validate_digest(payload: dict, label: str = "digest") -> dict:
    require_keys(payload, ["algorithm", "value"], label)
    if payload["algorithm"] != "sha256":
        raise RuntimeError(f"invalid digest algorithm for {label}: {payload['algorithm']}")
    return payload


def validate_template_bundle(payload: dict) -> dict:
    require_keys(payload, ["schemaVersion", "bundleFormat", "templateId", "version", "templateDigest", "manifest", "files"], "template bundle")
    if payload["bundleFormat"] != "rendo-bundle.v1":
        raise RuntimeError(f"invalid template bundle format: {payload['bundleFormat']}")
    validate_digest(payload["templateDigest"], "template bundle templateDigest")
    validate_template_manifest(payload["manifest"])
    for file in payload["files"]:
        require_keys(file, ["path", "encoding", "sha256", "content"], "template bundle file")
        if file["encoding"] != "base64":
            raise RuntimeError(f"invalid template bundle file encoding: {file['encoding']}")
    return payload


def validate_registry_auth(payload: dict) -> dict:
    require_keys(payload, ["type", "header", "scheme"], "registry auth")
    if payload["type"] not in AUTH_TYPES:
        raise RuntimeError(f"invalid registry auth type: {payload['type']}")
    return payload


def validate_registry_handshake(payload: dict) -> dict:
    require_keys(
        payload,
        [
            "schemaVersion",
            "protocolVersion",
            "registryId",
            "registryTitle",
            "apiBaseUrl",
            "auth",
            "cliCompatibility",
            "bundleFormat",
            "digestAlgorithm",
        ],
        "registry handshake",
    )
    validate_registry_auth(payload["auth"])
    validate_version_selector(payload["cliCompatibility"], "registry handshake cliCompatibility")
    if payload["bundleFormat"] != "rendo-bundle.v1":
        raise RuntimeError(f"invalid registry bundle format: {payload['bundleFormat']}")
    if payload["digestAlgorithm"] != "sha256":
        raise RuntimeError(f"invalid registry digest algorithm: {payload['digestAlgorithm']}")
    return payload


def validate_remote_search_response(payload: dict) -> dict:
    require_keys(payload, ["registry", "results"], "remote search response")
    require_keys(payload["registry"], ["id", "protocolVersion"], "remote search response registry")
    return payload


def validate_remote_inspect_response(payload: dict) -> dict:
    require_keys(payload, ["registry", "payload"], "remote inspect response")
    require_keys(payload["registry"], ["id", "protocolVersion"], "remote inspect response registry")
    if "manifest" in payload:
        validate_template_manifest(payload["manifest"])
    if "bundle" in payload:
        require_keys(payload["bundle"], ["url", "digest", "templateDigest", "bundleFormat"], "remote inspect response bundle")
        validate_digest(payload["bundle"]["digest"], "remote inspect response bundle digest")
        validate_digest(payload["bundle"]["templateDigest"], "remote inspect response bundle templateDigest")
    return payload
