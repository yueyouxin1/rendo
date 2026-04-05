from __future__ import annotations

import base64
import hashlib
import json
import shutil
import tempfile
from pathlib import Path

from .contracts import validate_template_bundle, validate_template_manifest
from .fs import read_json, write_json
from .version import TEMPLATE_SCHEMA_VERSION


def _sha256_hex(content: bytes | str) -> str:
    payload = content.encode("utf-8") if isinstance(content, str) else content
    return hashlib.sha256(payload).hexdigest()


def _walk_files(template_dir: Path) -> list[Path]:
    return sorted([path for path in template_dir.rglob("*") if path.is_file()], key=lambda item: item.as_posix())


def _load_bundle_files(template_dir: Path) -> list[dict]:
    files: list[dict] = []
    for file_path in _walk_files(template_dir):
      content = file_path.read_bytes()
      files.append(
          {
              "path": file_path.relative_to(template_dir).as_posix(),
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
