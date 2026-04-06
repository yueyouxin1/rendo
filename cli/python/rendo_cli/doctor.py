from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

from .contracts import validate_template_manifest
from .project import find_project_root, load_project_state
from .registry_client import prepare_template_source
from .template_assets import preview_template_asset_integration


def _run(command: list[str]) -> dict:
    executable = shutil.which(command[0])
    if not executable:
        return {"name": " ".join(command), "status": "fail", "detail": "command not available"}
    result = subprocess.run([executable, *command[1:]], capture_output=True, text=True)
    return {
        "name": " ".join(command),
        "status": "pass" if result.returncode == 0 else "fail",
        "detail": (result.stdout or result.stderr).strip() or "ok",
    }


def _verify_declared_paths(project_root: Path, relative_paths: list[str]) -> list[str]:
    return [relative_path for relative_path in relative_paths if not (project_root / relative_path).exists()]


def _normalize_relative_path(project_root: Path, target_path: Path) -> str:
    return target_path.relative_to(project_root).as_posix()


def run_doctor(cwd: Path) -> dict:
    checks = [
        _run(["node", "-v"]),
        _run(["npm", "-v"]),
        _run(["python", "--version"]),
        _run(["docker", "--version"]),
        _run(["docker", "compose", "version"]),
    ]
    project_root = find_project_root(cwd)
    if not project_root:
        checks.append({"name": "project root", "status": "warn", "detail": "no rendo project found"})
        return {"cwd": str(cwd), "checks": checks}

    project, template = load_project_state(project_root)
    checks.append(
        {
            "name": "starter manifest",
            "status": "pass",
            "detail": f"{template['id']}@{template['version']} ({template['type']})",
        }
    )
    checks.append({"name": "template architecture standard", "status": "pass", "detail": template["architecture"]["standard"]})
    checks.append({"name": "template host model", "status": "pass", "detail": template["architecture"]["hostModel"]})
    checks.append({"name": "template runtime class", "status": "pass", "detail": template["architecture"]["runtimeClass"]})
    architecture_checks = [
        ("template agent entrypoints", template["architecture"]["rootPaths"]["agentEntrypoints"]),
        ("template interface roots", template["architecture"]["rootPaths"]["interfaces"]),
        ("template implementation roots", template["architecture"]["rootPaths"]["implementation"]),
        ("template test roots", template["architecture"]["rootPaths"]["tests"]),
        ("template integration roots", template["architecture"]["rootPaths"]["integration"]),
        ("template operations roots", template["architecture"]["rootPaths"]["operations"]),
        ("template mount roots", template["architecture"]["rootPaths"]["mounts"]),
    ]
    for name, relative_paths in architecture_checks:
        missing = _verify_declared_paths(project_root, relative_paths)
        checks.append(
            {
                "name": name,
                "status": "pass" if not missing else "fail",
                "detail": ", ".join(relative_paths) if not missing else f"missing paths: {', '.join(missing)}",
            }
        )
    env_file = project_root / ".env.example"
    env_keys = set()
    if env_file.exists():
        env_keys = {
            line.split("=", 1)[0].strip()
            for line in env_file.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.strip().startswith("#")
        }
    missing = [key for key in template["requiredEnv"] if key not in env_keys]
    checks.append(
        {
            "name": "template env coverage",
            "status": "pass" if not missing else "warn",
            "detail": "all template env keys are represented in .env.example"
            if not missing
            else f"missing in .env.example: {', '.join(missing)}",
        }
    )
    if project["installedPacks"]:
        checks.append({"name": "installed packs", "status": "pass", "detail": str(len(project['installedPacks']))})
    for installed in project["installedTemplates"]:
        source = prepare_template_source(installed["id"])
        if source is None:
            checks.append(
                {
                    "name": f"installed template {installed['id']} registry metadata",
                    "status": "warn",
                    "detail": "installed in project manifest but missing from template registry",
                }
            )
            continue

        try:
            preview = preview_template_asset_integration(source, project_root)
            expected_target_path = _normalize_relative_path(project_root, Path(preview["targetPath"]))
            checks.append(
                {
                    "name": f"installed template {installed['id']} target root",
                    "status": "pass" if expected_target_path == installed["targetPath"] else "fail",
                    "detail": f"{preview['targetRoot']} -> {installed['targetPath']}"
                    if expected_target_path == installed["targetPath"]
                    else f"expected {expected_target_path} from {preview['targetRoot']}, found {installed['targetPath']}",
                }
            )

            manifest_path = project_root / installed["targetPath"] / "rendo.template.json"
            if not manifest_path.exists():
                checks.append(
                    {
                        "name": f"installed template {installed['id']} integration roots",
                        "status": "fail",
                        "detail": f"missing template manifest at {installed['targetPath']}/rendo.template.json",
                    }
                )
                continue

            installed_manifest = validate_template_manifest(__import__("json").loads(manifest_path.read_text(encoding="utf-8")))
            missing_integration_paths = _verify_declared_paths(project_root / installed["targetPath"], installed_manifest["architecture"]["rootPaths"]["integration"])
            checks.append(
                {
                    "name": f"installed template {installed['id']} integration roots",
                    "status": "pass" if not missing_integration_paths else "fail",
                    "detail": ", ".join(installed_manifest["architecture"]["rootPaths"]["integration"])
                    if not missing_integration_paths
                    else f"missing paths: {', '.join(missing_integration_paths)}",
                }
            )
        finally:
            source["cleanup"]()
    return {
        "cwd": str(cwd),
        "projectRoot": str(project_root),
        "templateArchitecture": template["architecture"],
        "checks": checks,
    }
