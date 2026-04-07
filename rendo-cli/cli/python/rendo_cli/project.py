from __future__ import annotations

from pathlib import Path

from .contracts import validate_project_manifest, validate_template_manifest
from .fs import read_json, write_json

WORKSPACE_METADATA_DIR = ".rendo"
PROJECT_MANIFEST_FILE = "rendo.project.json"
TEMPLATE_MANIFEST_FILE = "rendo.template.json"


def _workspace_metadata_paths(project_root: Path) -> dict[str, Path]:
    workspace_dir = project_root / WORKSPACE_METADATA_DIR
    return {
        "workspace_project": workspace_dir / PROJECT_MANIFEST_FILE,
        "workspace_template": workspace_dir / TEMPLATE_MANIFEST_FILE,
        "legacy_project": project_root / PROJECT_MANIFEST_FILE,
        "legacy_template": project_root / TEMPLATE_MANIFEST_FILE,
    }


def _mirror_workspace_metadata(project_root: Path, project: dict | None = None, template: dict | None = None) -> None:
    paths = _workspace_metadata_paths(project_root)
    if project is not None:
        write_json(paths["workspace_project"], project)
        paths["legacy_project"].unlink(missing_ok=True)

    if template is not None:
        write_json(paths["workspace_template"], template)
        paths["legacy_template"].unlink(missing_ok=True)


def _read_project_manifest(project_root: Path) -> dict | None:
    paths = _workspace_metadata_paths(project_root)
    if paths["workspace_project"].exists():
        return validate_project_manifest(read_json(paths["workspace_project"]))
    if paths["legacy_project"].exists():
        return validate_project_manifest(read_json(paths["legacy_project"]))
    return None


def _read_template_manifest(project_root: Path) -> dict | None:
    paths = _workspace_metadata_paths(project_root)
    if paths["workspace_template"].exists():
        return validate_template_manifest(read_json(paths["workspace_template"]))
    if paths["legacy_template"].exists():
        return validate_template_manifest(read_json(paths["legacy_template"]))
    return None


def find_project_root(start_dir: Path) -> Path | None:
    current = start_dir.resolve()
    while True:
        paths = _workspace_metadata_paths(current)
        if (paths["workspace_project"].exists() or paths["legacy_project"].exists()) and (
            paths["workspace_template"].exists() or paths["legacy_template"].exists()
        ):
            return current
        if current.parent == current:
            return None
        current = current.parent


def load_project_state(project_root: Path) -> tuple[dict, dict]:
    project = _read_project_manifest(project_root)
    template = _read_template_manifest(project_root)
    if project is None or template is None:
        raise RuntimeError(f"no rendo project found at {project_root}")
    return project, template


def save_project_manifest(project_root: Path, payload: dict) -> None:
    template = _read_template_manifest(project_root)
    _mirror_workspace_metadata(project_root, validate_project_manifest(payload), template)
