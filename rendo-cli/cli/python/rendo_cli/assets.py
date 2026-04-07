from __future__ import annotations

import os
import sys
from pathlib import Path


ASSET_ROOT_ENV = "RENDO_ASSET_ROOT"
PACKAGED_ASSET_DIR = "rendo_assets"
REPO_ROOT = Path(__file__).resolve().parents[3]


def get_asset_root() -> Path:
    env_value = os.environ.get(ASSET_ROOT_ENV)
    if env_value:
        return Path(env_value).resolve()

    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return (Path(getattr(sys, "_MEIPASS")) / PACKAGED_ASSET_DIR).resolve()

    release_candidate = (Path(__file__).resolve().parents[3] / PACKAGED_ASSET_DIR).resolve()
    if release_candidate.exists():
        return release_candidate

    return (REPO_ROOT / "shared").resolve()


def resolve_asset_path(relative_path: str) -> Path:
    normalized = relative_path.replace("\\", "/").lstrip("/")
    if normalized.startswith("shared/"):
        normalized = normalized[len("shared/") :]
    return get_asset_root() / normalized
