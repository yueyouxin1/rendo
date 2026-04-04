from __future__ import annotations

from pathlib import Path

from .contracts import validate_project_manifest, validate_template_manifest
from .fs import read_json, write_json


def find_project_root(start_dir: Path) -> Path | None:
    current = start_dir.resolve()
    while True:
        if (current / "rendo.project.json").exists() and (current / "rendo.template.json").exists():
            return current
        if current.parent == current:
            return None
        current = current.parent


def load_project_state(project_root: Path) -> tuple[dict, dict]:
    project = validate_project_manifest(read_json(project_root / "rendo.project.json"))
    template = validate_template_manifest(read_json(project_root / "rendo.template.json"))
    return project, template


def save_project_manifest(project_root: Path, payload: dict) -> None:
    write_json(project_root / "rendo.project.json", payload)
