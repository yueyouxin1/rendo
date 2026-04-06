from __future__ import annotations

from datetime import datetime, timezone
import os
from pathlib import Path

from .bundle import compute_directory_digest
from .fs import append_missing_env, compare_versions, copy_template_asset
from .project import load_project_state, save_project_manifest
from .registry_client import prepare_template_source


def _assert_compatible_host(manifest: dict, host_template: dict) -> None:
    compatibility = manifest["compatibility"]["hosts"]
    if not compatibility:
        return
    matched = next(
        (
            item
            for item in compatibility
            if (item["templateId"] is not None and item["templateId"] == host_template["id"])
            or item["templateKind"] == host_template["templateKind"]
        ),
        None,
    )
    if matched is None:
        raise RuntimeError(f"template {manifest['id']} does not apply to host {host_template['id']}")
    compatibility_target = matched["templateId"] or matched["templateKind"]
    if matched["minVersion"] and compare_versions(host_template["version"], matched["minVersion"]) < 0:
        raise RuntimeError(f"template {manifest['id']} requires host {compatibility_target} >= {matched['minVersion']}")
    if matched["maxVersion"] and compare_versions(host_template["version"], matched["maxVersion"]) > 0:
        raise RuntimeError(f"template {manifest['id']} requires host {compatibility_target} <= {matched['maxVersion']}")


def _resolve_integration_mode(manifest: dict, runtime_mode: str) -> dict:
    if manifest["assetIntegration"] is None:
        raise RuntimeError(f"template {manifest['id']} does not expose integration metadata")
    return next(
        (
            item
            for item in manifest["assetIntegration"]["modes"]
            if item["runtimeMode"] == runtime_mode
        ),
        next((item for item in manifest["assetIntegration"]["modes"] if item["runtimeMode"] == "source"), None),
    )


def preview_template_asset_integration(source: dict, project_root: Path) -> dict:
    manifest = source["manifest"]
    if manifest["templateKind"] == "starter-template":
        raise RuntimeError(f"use rendo create for starter templates: {manifest['id']}")
    project, _ = load_project_state(project_root)
    _assert_compatible_host(manifest, project["template"])
    integration_mode = _resolve_integration_mode(manifest, project["template"]["runtimeMode"])
    if integration_mode is None:
        raise RuntimeError(f"template {manifest['id']} does not support host runtime mode {project['template']['runtimeMode']}")
    target_path = project_root / integration_mode["targetRoot"] / manifest["id"]
    conflicts = []
    if target_path.exists():
        if integration_mode["conflictStrategy"] == "overwrite":
            conflicts.append("target directory already exists and will be overwritten")
        elif integration_mode["conflictStrategy"] == "fail":
            conflicts.append("target directory already exists")
    return {
        "templateId": manifest["id"],
        "templateKind": manifest["templateKind"],
        "templateRole": manifest["templateRole"],
        "runtimeMode": integration_mode["runtimeMode"],
        "targetPath": str(target_path),
        "targetRoot": integration_mode["targetRoot"],
        "integrationPlan": integration_mode["changes"],
        "conflicts": conflicts,
        "registry": source["registry"],
        "source": source["source"],
        "bundleDigest": source["bundleDigest"],
        "templateDigest": source["templateDigest"],
    }


def integrate_template_asset(source: dict, project_root: Path) -> dict:
    manifest = source["manifest"]
    preview = preview_template_asset_integration(source, project_root)
    integration_mode = _resolve_integration_mode(manifest, preview["runtimeMode"])
    target_path = Path(preview["targetPath"])
    if preview["conflicts"] and integration_mode["conflictStrategy"] == "fail":
        raise RuntimeError(f"template integration conflicts: {'; '.join(preview['conflicts'])}")
    if target_path.exists():
        if integration_mode["conflictStrategy"] == "overwrite":
            import shutil

            shutil.rmtree(target_path, ignore_errors=True)
        elif integration_mode["conflictStrategy"] == "skip":
            return {
                "templateId": manifest["id"],
                "templateKind": manifest["templateKind"],
                "templateRole": manifest["templateRole"],
                "targetPath": str(target_path),
                "copiedFiles": [],
                "addedEnv": [],
                "integrationPlan": preview["integrationPlan"],
                "skipped": True,
            }

    copied_files = copy_template_asset(source["templateDir"], target_path)
    added_env = append_missing_env(project_root / ".env.example", preview["integrationPlan"]["addsEnv"])

    project, _ = load_project_state(project_root)
    record = {
        "id": manifest["id"],
        "version": manifest["version"],
        "templateKind": manifest["templateKind"],
        "templateRole": manifest["templateRole"],
        "runtimeMode": project["template"]["runtimeMode"],
        "registry": source["registry"],
        "source": source["source"],
        "bundleDigest": source["bundleDigest"],
        "templateDigest": source["templateDigest"],
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
        "integrationPlan": preview["integrationPlan"],
    }


def upgrade_template_assets(project_root: Path, options: dict | None = None) -> list[dict]:
    project, _ = load_project_state(project_root)
    template_ref = options.get("templateRef") if options else None
    candidates = [item for item in project["installedTemplates"] if item["id"] == template_ref] if template_ref else project["installedTemplates"]
    if not candidates:
        raise RuntimeError(f"template is not installed: {template_ref}" if template_ref else "no template assets installed in project")

    results: list[dict] = []
    for installed in candidates:
        source = prepare_template_source(installed["id"], options)
        if source is None:
            results.append({"templateId": installed["id"], "currentVersion": installed["version"], "status": "missing-from-registry"})
            continue
        try:
            target_path = project_root / installed["targetPath"]
            current_digest = compute_directory_digest(target_path)["value"] if target_path.exists() else None
            if installed["templateDigest"] and current_digest and installed["templateDigest"] != current_digest:
                results.append(
                    {
                        "templateId": installed["id"],
                        "currentVersion": installed["version"],
                        "latestVersion": source["manifest"]["version"],
                        "status": "manual-intervention",
                        "reason": "local modifications detected",
                    }
                )
                continue

            preview = preview_template_asset_integration(source, project_root)
            same_version = compare_versions(installed["version"], source["manifest"]["version"]) >= 0
            same_digest = installed["templateDigest"] and source["templateDigest"] and installed["templateDigest"] == source["templateDigest"]
            if same_version and same_digest:
                results.append(
                    {
                        "templateId": installed["id"],
                        "currentVersion": installed["version"],
                        "latestVersion": source["manifest"]["version"],
                        "status": "up-to-date",
                    }
                )
                continue

            if options and options.get("preview"):
                results.append(
                    {
                        "templateId": installed["id"],
                        "currentVersion": installed["version"],
                        "latestVersion": source["manifest"]["version"],
                        "status": "preview",
                        "integrationPlan": preview["integrationPlan"],
                    }
                )
                continue

            if target_path.exists():
                import shutil

                shutil.rmtree(target_path, ignore_errors=True)
            applied = integrate_template_asset(source, project_root)
            results.append(
                {
                    "templateId": installed["id"],
                    "currentVersion": installed["version"],
                    "latestVersion": source["manifest"]["version"],
                    "status": "upgraded",
                    "integrationPlan": applied["integrationPlan"],
                }
            )
        finally:
            source["cleanup"]()
    return results
