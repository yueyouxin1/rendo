from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

from .project import find_project_root, load_project_state


def _run(command: list[str]) -> dict:
    executable = shutil.which(command[0])
    if not executable:
      return {"name": " ".join(command), "status": "fail", "detail": "command not available"}
    result = subprocess.run(command, capture_output=True, text=True)
    return {
        "name": " ".join(command),
        "status": "pass" if result.returncode == 0 else "fail",
        "detail": (result.stdout or result.stderr).strip() or "ok",
    }


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
    return {"cwd": str(cwd), "projectRoot": str(project_root), "checks": checks}
