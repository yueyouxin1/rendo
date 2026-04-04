from __future__ import annotations

import json
import shutil
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[3]


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        handle.write(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")


def ensure_missing_or_empty_dir(path: Path) -> None:
    if not path.exists():
        path.mkdir(parents=True, exist_ok=True)
        return
    if any(path.iterdir()):
        raise RuntimeError(f"target directory is not empty: {path}")


def copy_tree_with_replacements(source: Path, target: Path, replacements: dict[str, str]) -> list[str]:
    copied: list[str] = []
    for file_path in source.rglob("*"):
      if file_path.is_dir():
        continue
      relative = file_path.relative_to(source)
      target_file = target / relative
      target_file.parent.mkdir(parents=True, exist_ok=True)
      content = file_path.read_bytes()
      try:
        text = content.decode("utf-8")
        for old, new in replacements.items():
          text = text.replace(old, new)
        target_file.write_bytes(text.encode("utf-8"))
      except UnicodeDecodeError:
        target_file.write_bytes(content)
      copied.append(relative.as_posix())
    return copied


def copy_template_asset(source: Path, target: Path) -> list[str]:
    ensure_missing_or_empty_dir(target)
    return copy_tree_with_replacements(source, target, {})


def slugify(value: str) -> str:
    import re

    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", value.strip().lower()))


def append_missing_env(path: Path, env_keys: list[str]) -> list[str]:
    existing = path.read_text(encoding="utf-8") if path.exists() else ""
    existing_keys = {
        line.split("=", 1)[0].strip()
        for line in existing.splitlines()
        if line.strip() and not line.strip().startswith("#")
    }
    missing = [key for key in env_keys if key not in existing_keys]
    if not missing:
        return []
    payload = existing.rstrip()
    if payload:
        payload += "\n\n"
    payload += "# Added by rendo add\n" + "\n".join(f"{key}=" for key in missing) + "\n"
    path.write_text(payload, encoding="utf-8")
    return missing


def remove_tree(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)


def append_missing_env(path: Path, env_keys: list[str]) -> list[str]:
    existing = path.read_text(encoding="utf-8") if path.exists() else ""
    existing_keys = {
        line.split("=", 1)[0].strip()
        for line in existing.splitlines()
        if line.strip() and not line.strip().startswith("#")
    }
    missing = [key for key in env_keys if key not in existing_keys]
    if not missing:
        return []
    payload = existing.rstrip()
    if payload:
        payload += "\n\n"
    payload += "# Added by rendo add\n" + "\n".join(f"{key}=" for key in missing) + "\n"
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        handle.write(payload)
    return missing
