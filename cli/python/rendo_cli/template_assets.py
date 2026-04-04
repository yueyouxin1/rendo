from __future__ import annotations

from pathlib import Path
from datetime import datetime, timezone
import os

from .fs import REPO_ROOT, append_missing_env, copy_template_asset
from .project import load_project_state, save_project_manifest
from .registry import load_template_manifest


TEMPLATE_INSTALL_ROOTS = {
    "feature-template": "features",
    "capability-template": "capabilities",
    "provider-template": "providers",
    "surface-template": "surfaces",
}


def install_template_asset(template_entry: dict, project_root: Path) -> dict:
    manifest = load_template_manifest(template_entry)
    if manifest["templateKind"] == "starter-template":
        raise RuntimeError(f"use rendo create for starter templates: {manifest['id']}")

    install_root = TEMPLATE_INSTALL_ROOTS.get(manifest["templateKind"])
    if install_root is None:
        raise RuntimeError(f"unsupported template kind for add: {manifest['templateKind']}")

    target_path = project_root / install_root / manifest["id"]
    copied_files = copy_template_asset(REPO_ROOT / template_entry["templatePath"], target_path)
    added_env = append_missing_env(project_root / ".env.example", manifest["requiredEnv"])

    project, _ = load_project_state(project_root)
    record = {
        "id": manifest["id"],
        "templateKind": manifest["templateKind"],
        "templateRole": manifest["templateRole"],
        "targetPath": target_path.relative_to(project_root).as_posix(),
        "installedAt": os.environ.get("RENDO_INSTALLED_AT_OVERRIDE", datetime.now(timezone.utc).isoformat()),
    }
    existing_index = next((index for index, item in enumerate(project["installedTemplates"]) if item["id"] == manifest["id"]), None)
    if existing_index is None:
        project["installedTemplates"].append(record)
    else:
        project["installedTemplates"][existing_index] = record
    save_project_manifest(project_root, project)

    return {
        "templateId": manifest["id"],
        "templateKind": manifest["templateKind"],
        "templateRole": manifest["templateRole"],
        "targetPath": str(target_path),
        "copiedFiles": copied_files,
        "addedEnv": added_env,
    }
