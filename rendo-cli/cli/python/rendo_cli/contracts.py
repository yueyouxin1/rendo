from __future__ import annotations


RUNTIME_MODES = {"source", "managed", "hybrid"}
TEMPLATE_TYPES = {"template"}
TEMPLATE_KINDS = {"starter-template", "feature-template", "capability-template", "provider-template", "surface-template"}
TEMPLATE_ROLES = {"core", "base", "derived"}
SURFACES = {"web", "miniapp", "mobile", "desktop"}
CONFLICT_STRATEGIES = {"fail", "overwrite", "skip"}
ROLLBACK_STRATEGIES = {"safe-abort", "manual"}
AUTH_TYPES = {"none", "bearer-token"}
TEMPLATE_HOST_MODELS = {"host-root", "host-attached"}
TEMPLATE_RUNTIME_CLASSES = {"standalone-runnable", "host-attached"}


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


def validate_template_architecture(payload: dict) -> dict:
    require_keys(payload, ["standard", "hostModel", "runtimeClass", "rootPaths"], "template architecture")
    if payload["hostModel"] not in TEMPLATE_HOST_MODELS:
        raise RuntimeError(f"invalid template host model: {payload['hostModel']}")
    if payload["runtimeClass"] not in TEMPLATE_RUNTIME_CLASSES:
        raise RuntimeError(f"invalid template runtime class: {payload['runtimeClass']}")
    require_keys(
        payload["rootPaths"],
        ["agentEntrypoints", "docs", "interfaces", "implementation", "tests", "scripts", "integration", "operations", "mounts"],
        "template architecture rootPaths",
    )
    return payload


def validate_asset_integration(payload: dict | None) -> dict | None:
    if payload is None:
        return None

    require_keys(payload, ["previewSummary", "supportedHostKinds", "supportedHostTemplates", "modes"], "asset integration")
    if any(kind not in TEMPLATE_KINDS for kind in payload["supportedHostKinds"]):
        raise RuntimeError("invalid supported host kind in asset integration")
    for mode in payload["modes"]:
        require_keys(
            mode,
            ["runtimeMode", "targetRoot", "conflictStrategy", "rollbackStrategy", "changes"],
            "asset integration mode",
        )
        if mode["runtimeMode"] not in RUNTIME_MODES:
            raise RuntimeError(f"invalid asset integration runtime mode: {mode['runtimeMode']}")
        if mode["conflictStrategy"] not in CONFLICT_STRATEGIES:
            raise RuntimeError(f"invalid conflict strategy: {mode['conflictStrategy']}")
        if mode["rollbackStrategy"] not in ROLLBACK_STRATEGIES:
            raise RuntimeError(f"invalid rollback strategy: {mode['rollbackStrategy']}")
        validate_install_plan(mode["changes"], "asset integration mode changes")
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
            "architecture",
            "surfaceCapabilities",
            "defaultSurfaces",
            "surfacePaths",
            "supports",
            "compatibility",
            "assetIntegration",
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
    require_keys(payload["lineage"], ["coreTemplate", "baseTemplate", "parentTemplate"], "template lineage")
    require_keys(
        payload["documentation"],
        ["overview", "structure", "extensionPoints", "inheritanceBoundaries", "secondaryDevelopment"],
        "template documentation",
    )
    validate_template_architecture(payload["architecture"])
    if any(surface not in SURFACES for surface in payload["surfaceCapabilities"]):
        raise RuntimeError("invalid surface in template manifest")
    if any(surface not in SURFACES for surface in payload["defaultSurfaces"]):
        raise RuntimeError("invalid default surface in template manifest")
    validate_template_compatibility(payload["compatibility"])
    validate_asset_integration(payload["assetIntegration"])
    return payload


def validate_project_manifest(payload: dict) -> dict:
    require_keys(payload, ["schemaVersion", "projectName", "surfaces", "template", "installedTemplates", "installedPacks"], "project manifest")
    if "workspaceId" in payload and (not isinstance(payload["workspaceId"], str) or not payload["workspaceId"]):
        raise RuntimeError("invalid workspace id")
    require_keys(
        payload["template"],
        ["id", "templateKind", "templateRole", "version", "runtimeMode", "createdFrom", "createdAt"],
        "project template",
    )
    if "origin" in payload:
        require_keys(
            payload["origin"],
            ["createdBy", "registry", "source", "templateId", "templateKind", "templateRole", "templateVersion", "runtimeMode"],
            "project origin",
        )
        if payload["origin"]["source"] not in {"local", "remote"}:
            raise RuntimeError(f"invalid project origin source: {payload['origin']['source']}")
        if payload["origin"]["templateKind"] not in TEMPLATE_KINDS:
            raise RuntimeError(f"invalid project origin template kind: {payload['origin']['templateKind']}")
        if payload["origin"]["templateRole"] not in TEMPLATE_ROLES:
            raise RuntimeError(f"invalid project origin template role: {payload['origin']['templateRole']}")
        if payload["origin"]["runtimeMode"] not in RUNTIME_MODES:
            raise RuntimeError(f"invalid project origin runtime mode: {payload['origin']['runtimeMode']}")
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
    normalized = {
        "schemaVersion": payload["schemaVersion"],
        "projectName": payload["projectName"],
    }
    if "workspaceId" in payload:
        normalized["workspaceId"] = payload["workspaceId"]
    normalized["surfaces"] = payload["surfaces"]
    normalized["template"] = payload["template"]
    if "origin" in payload:
        normalized["origin"] = payload["origin"]
    normalized["installedTemplates"] = payload["installedTemplates"]
    normalized["installedPacks"] = payload["installedPacks"]
    return normalized


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
    if "snapshot" in payload:
        require_keys(payload["snapshot"], ["url", "digest"], "registry handshake snapshot")
        validate_digest(payload["snapshot"]["digest"], "registry handshake snapshot digest")
    if payload["bundleFormat"] != "rendo-bundle.v1":
        raise RuntimeError(f"invalid registry bundle format: {payload['bundleFormat']}")
    if payload["digestAlgorithm"] != "sha256":
        raise RuntimeError(f"invalid registry digest algorithm: {payload['digestAlgorithm']}")
    return payload


def validate_registry_snapshot(payload: dict) -> dict:
    require_keys(payload, ["schemaVersion", "catalogFormat", "generatedAt", "registry", "entries"], "registry snapshot")
    if payload["catalogFormat"] != "rendo-runtime-catalog.v1":
        raise RuntimeError(f"invalid registry snapshot format: {payload['catalogFormat']}")
    require_keys(payload["registry"], ["id", "protocolVersion", "bundleFormat", "digestAlgorithm"], "registry snapshot registry")
    if payload["registry"]["bundleFormat"] != "rendo-bundle.v1":
        raise RuntimeError(f"invalid registry snapshot bundle format: {payload['registry']['bundleFormat']}")
    if payload["registry"]["digestAlgorithm"] != "sha256":
        raise RuntimeError(f"invalid registry snapshot digest algorithm: {payload['registry']['digestAlgorithm']}")
    for entry in payload["entries"]:
        require_keys(
            entry,
            [
                "id",
                "ref",
                "aliases",
                "official",
                "templateKind",
                "templateRole",
                "version",
                "runtimeModes",
                "requiredEnv",
                "toolchains",
                "lineage",
                "architecture",
                "surfaceCapabilities",
                "defaultSurfaces",
                "surfacePaths",
                "supports",
                "compatibility",
                "assetIntegration",
                "artifacts",
            ],
            "registry snapshot entry",
        )
        if entry["templateKind"] not in TEMPLATE_KINDS:
            raise RuntimeError(f"invalid registry snapshot template kind: {entry['templateKind']}")
        if entry["templateRole"] not in TEMPLATE_ROLES:
            raise RuntimeError(f"invalid registry snapshot template role: {entry['templateRole']}")
        if any(mode not in RUNTIME_MODES for mode in entry["runtimeModes"]):
            raise RuntimeError("invalid runtime mode in registry snapshot entry")
        validate_template_architecture(entry["architecture"])
        validate_template_compatibility(entry["compatibility"])
        validate_asset_integration(entry["assetIntegration"])
        require_keys(entry["artifacts"], ["manifestPath", "templatePath", "bundlePath", "bundleDigest", "templateDigest"], "registry snapshot entry artifacts")
        validate_digest(entry["artifacts"]["bundleDigest"], "registry snapshot entry bundleDigest")
        validate_digest(entry["artifacts"]["templateDigest"], "registry snapshot entry templateDigest")
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
