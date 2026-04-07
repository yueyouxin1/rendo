from __future__ import annotations

from datetime import datetime, timezone
import hashlib
import os
from pathlib import Path
import shutil

from .contracts import validate_project_manifest, validate_template_manifest
from .fs import copy_tree_with_replacements, ensure_missing_or_empty_dir, read_json, slugify, write_json


def resolve_selected_surfaces(manifest: dict, requested_surfaces: list[str] | None) -> list[str]:
    capabilities = manifest.get("surfaceCapabilities", [])
    if not capabilities:
        return []

    selected = requested_surfaces or manifest.get("defaultSurfaces") or ["web"]
    invalid = [surface for surface in selected if surface not in capabilities]
    if invalid:
        raise RuntimeError(f"unsupported surfaces for {manifest['id']}: {', '.join(invalid)}")
    if "web" not in selected:
        raise RuntimeError(f"current implementation requires the web surface; requested surfaces: {', '.join(selected)}")
    return list(dict.fromkeys(selected))


def prune_unselected_surfaces(target: Path, manifest: dict, selected_surfaces: list[str]) -> None:
    capabilities = manifest.get("surfaceCapabilities", [])
    surface_paths = manifest.get("surfacePaths", {})
    for surface in capabilities:
        if surface in selected_surfaces:
            continue
        for relative_path in surface_paths.get(surface, []):
            path = target / relative_path
            if path.is_dir():
                shutil.rmtree(path, ignore_errors=True)
            elif path.exists():
                path.unlink()


def build_workspace_id(template_id: str, project_name: str, created_at: str) -> str:
    slug = slugify(project_name) or "workspace"
    digest = hashlib.sha256(f"{template_id}:{slug}:{created_at}".encode("utf-8")).hexdigest()[:12]
    return f"ws-{slug}-{digest}"


def persist_workspace_metadata(
    source: dict,
    target: Path,
    selected_runtime: str,
    selected_surfaces: list[str],
    creation_mode: str,
) -> None:
    manifest = source["manifest"]
    project = validate_project_manifest(read_json(target / "rendo.project.json"))
    project["surfaces"] = selected_surfaces
    project["template"]["templateRole"] = "derived"
    project["workspaceId"] = build_workspace_id(manifest["id"], project["projectName"], project["template"]["createdAt"])
    project["origin"] = {
        "createdBy": creation_mode,
        "registry": source["registry"],
        "source": source["source"],
        "templateId": manifest["id"],
        "templateKind": manifest["templateKind"],
        "templateRole": manifest["templateRole"],
        "templateVersion": manifest["version"],
        "runtimeMode": selected_runtime,
    }
    template = validate_template_manifest(read_json(target / "rendo.template.json"))
    template["templateRole"] = "derived"
    write_json(target / ".rendo" / "rendo.project.json", project)
    write_json(target / ".rendo" / "rendo.template.json", template)
    (target / "rendo.project.json").unlink(missing_ok=True)
    (target / "rendo.template.json").unlink(missing_ok=True)


def scaffold_template(
    source: dict,
    target_dir: str,
    runtime_mode: str | None = None,
    requested_surfaces: list[str] | None = None,
    creation_mode: str = "rendo.create",
) -> dict:
    target = Path(target_dir).resolve()
    ensure_missing_or_empty_dir(target)

    manifest = source["manifest"]
    selected_runtime = runtime_mode or manifest["runtimeModes"][0]
    selected_surfaces = resolve_selected_surfaces(manifest, requested_surfaces)
    project_name = target.name
    created_at = os.environ.get("RENDO_CREATED_AT_OVERRIDE", datetime.now(timezone.utc).isoformat())
    replacements = {
        "__RENDO_PROJECT_NAME__": project_name,
        "__RENDO_PROJECT_SLUG__": slugify(project_name),
        "__RENDO_TEMPLATE_ID__": manifest["id"],
        "__RENDO_TEMPLATE_TITLE__": manifest["title"],
        "__RENDO_TEMPLATE_KIND__": manifest["templateKind"],
        "__RENDO_TEMPLATE_ROLE__": manifest["templateRole"],
        "__RENDO_TEMPLATE_VERSION__": manifest["version"],
        "__RENDO_RUNTIME_MODE__": selected_runtime,
        "__RENDO_CREATED_AT__": created_at,
        "__RENDO_SELECTED_SURFACES__": ", ".join(selected_surfaces) if selected_surfaces else "none",
    }
    copied = copy_tree_with_replacements(source["templateDir"], target, replacements)
    prune_unselected_surfaces(target, manifest, selected_surfaces)
    persist_workspace_metadata(source, target, selected_runtime, selected_surfaces, creation_mode)
    normalized_copied = [
        relative_path
        for relative_path in copied
        if relative_path not in {"rendo.project.json", "rendo.template.json"}
    ] + [
        ".rendo/rendo.project.json",
        ".rendo/rendo.template.json",
    ]
    return {
        "targetDir": str(target),
        "templateId": manifest["id"],
        "copiedFiles": normalized_copied,
        "selectedSurfaces": selected_surfaces,
        "nextSteps": [f"cd {target}", "npm install", "npm run health", "npm run check"],
    }
