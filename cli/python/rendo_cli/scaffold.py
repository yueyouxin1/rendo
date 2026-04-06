from __future__ import annotations

from datetime import datetime, timezone
import os
from pathlib import Path
import shutil

from .contracts import validate_project_manifest
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


def persist_project_surfaces(target: Path, selected_surfaces: list[str]) -> None:
    payload = validate_project_manifest(read_json(target / "rendo.project.json"))
    payload["surfaces"] = selected_surfaces
    write_json(target / "rendo.project.json", payload)


def scaffold_template(source: dict, target_dir: str, runtime_mode: str | None = None, requested_surfaces: list[str] | None = None) -> dict:
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
    persist_project_surfaces(target, selected_surfaces)
    return {
        "targetDir": str(target),
        "templateId": manifest["id"],
        "copiedFiles": copied,
        "selectedSurfaces": selected_surfaces,
        "nextSteps": [f"cd {target}", "npm install", "npm run health", "npm run check"],
    }
