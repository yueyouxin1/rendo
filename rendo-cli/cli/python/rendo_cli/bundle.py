from __future__ import annotations

import base64
import hashlib
import json
import re
import subprocess
import shutil
import tempfile
from pathlib import Path

from .contracts import validate_template_bundle, validate_template_manifest
from .fs import read_json, write_json
from .project import load_project_state
from .version import TEMPLATE_SCHEMA_VERSION


def _sha256_hex(content: bytes | str) -> str:
    payload = content.encode("utf-8") if isinstance(content, str) else content
    return hashlib.sha256(payload).hexdigest()


def _walk_files(template_dir: Path) -> list[Path]:
    return sorted([path for path in template_dir.rglob("*") if path.is_file()], key=lambda item: item.as_posix())


def _git_ignore_candidates(files: list[str]) -> list[str]:
    return [file for file in files if not file.startswith(".git/") and not file.startswith(".rendo/")]


def _should_force_include_workspace_file(relative_path: str) -> bool:
    return relative_path in {".rendo/rendo.project.json", ".rendo/rendo.template.json"}


def _pattern_to_regex(pattern: str, directory_only: bool) -> re.Pattern[str]:
    anchored = pattern.startswith("/")
    normalized_pattern = pattern[1:] if anchored else pattern
    source = ""
    index = 0
    while index < len(normalized_pattern):
        char = normalized_pattern[index]
        next_char = normalized_pattern[index + 1] if index + 1 < len(normalized_pattern) else ""
        if char == "*":
            if next_char == "*":
                source += ".*"
                index += 2
                continue
            source += "[^/]*"
            index += 1
            continue
        if char == "?":
            source += "[^/]"
            index += 1
            continue
        source += re.escape(char)
        index += 1

    if "/" not in normalized_pattern:
        source = f"(^|.*/){source}"
    elif not anchored:
        source = f"(^|.*/){source}"
    else:
        source = f"^{source}"

    suffix = r"(?:/.*)?$" if directory_only else "$"
    return re.compile(source if source.endswith("$") else f"{source}{suffix}")


def _resolve_ignored_workspace_files(root_dir: Path, relative_paths: list[str]) -> set[str]:
    candidates = _git_ignore_candidates(relative_paths)
    if not candidates or not (root_dir / ".gitignore").exists():
        return set()

    try:
        result = subprocess.run(
            ["git", "check-ignore", "--no-index", "-z", "--stdin"],
            cwd=root_dir,
            input=("\0".join(candidates) + "\0").encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
        if result.returncode in (0, 1):
            return {item for item in result.stdout.decode("utf-8").split("\0") if item}
    except FileNotFoundError:
        pass

    patterns = []
    for raw_line in (root_dir / ".gitignore").read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        negated = line.startswith("!")
        raw_pattern = line[1:] if negated else line
        directory_only = raw_pattern.endswith("/")
        pattern = raw_pattern[:-1] if directory_only else raw_pattern
        patterns.append({"negated": negated, "regex": _pattern_to_regex(pattern, directory_only)})

    ignored: set[str] = set()
    for relative_path in candidates:
        matched = False
        for pattern in patterns:
            if pattern["regex"].search(relative_path):
                matched = not pattern["negated"]
        if matched:
            ignored.add(relative_path)
    return ignored


def _load_bundle_files(template_dir: Path, include_relative_path=None) -> list[dict]:
    files: list[dict] = []
    for file_path in _walk_files(template_dir):
        relative_path = file_path.relative_to(template_dir).as_posix()
        if include_relative_path is not None and not include_relative_path(relative_path):
            continue
        content = file_path.read_bytes()
        files.append(
            {
                "path": relative_path,
                "content": content,
                "sha256": _sha256_hex(content),
            }
        )
    return files


def compute_template_digest(files: list[dict]) -> dict:
    payload = "\n".join(f"{item['path']}\n{item['sha256']}" for item in sorted(files, key=lambda item: item["path"]))
    return {"algorithm": "sha256", "value": _sha256_hex(payload)}


def compute_directory_digest(template_dir: Path) -> dict:
    return compute_template_digest(_load_bundle_files(template_dir))


def create_template_bundle(template_dir: Path) -> dict:
    manifest = validate_template_manifest(read_json(template_dir / "rendo.template.json"))
    files = _load_bundle_files(template_dir)
    return validate_template_bundle(
        {
            "schemaVersion": TEMPLATE_SCHEMA_VERSION,
            "bundleFormat": "rendo-bundle.v1",
            "templateId": manifest["id"],
            "version": manifest["version"],
            "templateDigest": compute_template_digest(files),
            "manifest": manifest,
            "files": [
                {
                    "path": item["path"],
                    "encoding": "base64",
                    "sha256": item["sha256"],
                    "content": base64.b64encode(item["content"]).decode("ascii"),
                }
                for item in files
            ],
        }
    )


def create_workspace_publish_bundle(project_root: Path) -> dict:
    _, template = load_project_state(project_root)
    all_files = [
        file_path.relative_to(project_root).as_posix()
        for file_path in _walk_files(project_root)
        if not file_path.relative_to(project_root).as_posix().startswith(".git/")
    ]
    ignored_files = _resolve_ignored_workspace_files(project_root, all_files)
    files = _load_bundle_files(
        project_root,
        include_relative_path=lambda relative_path: _should_force_include_workspace_file(relative_path) or relative_path not in ignored_files,
    )
    return validate_template_bundle(
        {
            "schemaVersion": TEMPLATE_SCHEMA_VERSION,
            "bundleFormat": "rendo-bundle.v1",
            "templateId": template["id"],
            "version": template["version"],
            "templateDigest": compute_template_digest(files),
            "manifest": template,
            "files": [
                {
                    "path": item["path"],
                    "encoding": "base64",
                    "sha256": item["sha256"],
                    "content": base64.b64encode(item["content"]).decode("ascii"),
                }
                for item in files
            ],
        }
    )


def serialize_template_bundle(bundle: dict) -> bytes:
    return (json.dumps(bundle, indent=2, ensure_ascii=False) + "\n").encode("utf-8")


def compute_bundle_digest(raw_bundle: bytes) -> dict:
    return {"algorithm": "sha256", "value": _sha256_hex(raw_bundle)}


def parse_template_bundle(raw_bundle: bytes) -> tuple[dict, dict]:
    bundle = validate_template_bundle(json.loads(raw_bundle.decode("utf-8")))
    return bundle, compute_bundle_digest(raw_bundle)


def extract_template_bundle(bundle: dict, target_dir: Path) -> list[str]:
    target_dir.mkdir(parents=True, exist_ok=True)
    written: list[str] = []
    for file in bundle["files"]:
        target_file = target_dir / file["path"]
        target_file.parent.mkdir(parents=True, exist_ok=True)
        content = base64.b64decode(file["content"].encode("ascii"))
        if _sha256_hex(content) != file["sha256"]:
            raise RuntimeError(f"bundle file digest mismatch: {file['path']}")
        target_file.write_bytes(content)
        written.append(file["path"])
    return written


def create_temporary_bundle_extraction(raw_bundle: bytes) -> dict:
    bundle, bundle_digest = parse_template_bundle(raw_bundle)
    template_dir = Path(tempfile.mkdtemp(prefix="rendo-template-bundle-"))
    extract_template_bundle(bundle, template_dir)
    write_json(template_dir / "rendo.template.json", bundle["manifest"])
    return {
        "bundle": bundle,
        "templateDir": template_dir,
        "bundleDigest": bundle_digest,
        "cleanup": lambda: shutil.rmtree(template_dir, ignore_errors=True),
    }
