from __future__ import annotations

from datetime import datetime, timezone
import os
from pathlib import Path

from .fs import append_missing_env, compare_versions, copy_tree_with_replacements
from .project import load_project_state, save_project_manifest
from .registry_client import load_pack_manifest, resolve_pack_ref


def _assert_pack_applies_to_project(pack_entry: dict, project_root: Path) -> None:
    manifest = load_pack_manifest(pack_entry)
    if not manifest["appliesTo"]:
        return
    _, template = load_project_state(project_root)
    if template["id"] not in manifest["appliesTo"]:
        raise RuntimeError(f"pack {manifest['name']} does not apply to starter {template['id']}")


def install_pack(pack_entry: dict, project_root: Path) -> dict:
    _assert_pack_applies_to_project(pack_entry, project_root)
    manifest = load_pack_manifest(pack_entry)
    source_dir = Path(__file__).resolve().parents[3] / pack_entry["filesPath"]
    copied_files = copy_tree_with_replacements(source_dir, project_root, {})
    added_env = append_missing_env(project_root / ".env.example", manifest["install"]["addsEnv"])

    project, _ = load_project_state(project_root)
    record = {
        "name": manifest["name"],
        "version": manifest["version"],
        "runtimeMode": manifest["runtimeMode"],
        "provider": manifest["provider"],
        "installedAt": os.environ.get("RENDO_INSTALLED_AT_OVERRIDE", datetime.now(timezone.utc).isoformat()),
    }
    existing_index = next((index for index, item in enumerate(project["installedPacks"]) if item["name"] == manifest["name"]), None)
    if existing_index is None:
        project["installedPacks"].append(record)
    else:
        project["installedPacks"][existing_index] = record
    save_project_manifest(project_root, project)

    return {
        "pack": manifest["name"],
        "version": manifest["version"],
        "targetDir": str(project_root),
        "copiedFiles": copied_files,
        "addedEnv": added_env,
        "installPlan": manifest["install"],
    }


def preview_pack(pack_entry: dict) -> dict:
    manifest = load_pack_manifest(pack_entry)
    return {
        "name": manifest["name"],
        "version": manifest["version"],
        "runtimeMode": manifest["runtimeMode"],
        "provider": manifest["provider"],
        "requiredEnv": manifest["requiredEnv"],
        "dependencies": manifest["dependencies"],
        "install": manifest["install"],
        "official": pack_entry["official"],
    }


def upgrade_packs(project_root: Path, requested_pack: str | None = None) -> list[dict]:
    project, _ = load_project_state(project_root)
    candidates = [item for item in project["installedPacks"] if item["name"] == requested_pack] if requested_pack else project["installedPacks"]
    if not candidates:
        raise RuntimeError(f"pack is not installed: {requested_pack}" if requested_pack else "no packs installed in project")

    results: list[dict] = []
    for installed in candidates:
        pack_entry = resolve_pack_ref(installed["name"])
        if pack_entry is None:
            raise RuntimeError(f"pack no longer exists in registry: {installed['name']}")
        manifest = load_pack_manifest(pack_entry)
        if compare_versions(installed["version"], manifest["version"]) >= 0:
            results.append(
                {
                    "pack": installed["name"],
                    "currentVersion": installed["version"],
                    "latestVersion": manifest["version"],
                    "status": "up-to-date",
                }
            )
            continue
        install_pack(pack_entry, project_root)
        results.append(
            {
                "pack": installed["name"],
                "currentVersion": installed["version"],
                "latestVersion": manifest["version"],
                "status": "upgraded",
            }
        )
    return results
