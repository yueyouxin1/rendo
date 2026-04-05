from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .doctor import run_doctor
from .project import find_project_root, load_project_state
from .registry import (
    load_pack_manifest,
    load_template_manifest,
    resolve_core_template_ref,
    resolve_pack_ref,
    resolve_starter_ref,
    resolve_template_ref,
    search_registry,
)
from .scaffold import scaffold_template
from .fs import REPO_ROOT, copy_template_asset
from .template_assets import install_template_asset


def _emit(payload, as_json: bool) -> None:
    if as_json:
        print(json.dumps(payload, indent=2))
    else:
        print(payload)


def _inspect(ref: str) -> dict:
    template = resolve_template_ref(ref)
    if template:
        manifest = load_template_manifest(template)
        return {
            "kind": manifest["templateKind"],
            "id": manifest["id"],
            "title": manifest["title"],
            "version": manifest["version"],
            "type": manifest["type"],
            "templateKind": manifest["templateKind"],
            "templateRole": manifest["templateRole"],
            "description": manifest["description"],
            "category": manifest["category"],
            "uiMode": manifest["uiMode"],
            "domainTags": manifest["domainTags"],
            "scenarioTags": manifest["scenarioTags"],
            "toolchains": manifest["toolchains"],
            "surfaceCapabilities": manifest["surfaceCapabilities"],
            "defaultSurfaces": manifest["defaultSurfaces"],
            "runtimeModes": manifest["runtimeModes"],
            "requiredEnv": manifest["requiredEnv"],
            "dependencies": manifest["recommendedPacks"],
            "official": template["official"],
        }
    pack = resolve_pack_ref(ref)
    if pack:
        manifest = load_pack_manifest(pack)
        return {
            "kind": "pack",
            "id": manifest["name"],
            "title": manifest["title"],
            "version": manifest["version"],
            "type": manifest["type"],
            "description": manifest["description"],
            "runtimeMode": manifest["runtimeMode"],
            "provider": manifest["provider"],
            "requiredEnv": manifest["requiredEnv"],
            "dependencies": manifest["dependencies"],
            "official": pack["official"],
            "install": manifest["install"],
        }
    raise RuntimeError(f"unable to resolve ref: {ref}")


def _resolve_create_args(args) -> tuple[dict, str]:
    starter = None
    target_dir = args.output
    starter_option = args.from_url or args.starter

    if starter_option:
        starter = resolve_starter_ref(starter_option)
        target_dir = target_dir or args.first
    elif args.first and args.second:
        starter = resolve_starter_ref(args.first)
        target_dir = target_dir or args.second
    elif args.first:
        starter = resolve_starter_ref(args.first)
        if starter is None:
            target_dir = target_dir or args.first

    if starter is None:
        ref = input("Starter ref (for example: rendo:application-base-starter): ").strip()
        starter = resolve_starter_ref(ref)
    if starter is None:
        raise RuntimeError("starter not found in registry")
    if not target_dir:
        target_dir = "."
    return starter, target_dir


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="rendo-python",
        description="Rendo starter and template control plane",
        epilog="\n".join(
            [
                "Examples:",
                "  rendo-python init starter --output my-starter-core",
                "  rendo-python init capability --output my-capability-core",
                "  rendo-python create application --surfaces web,miniapp --output my-app",
                "  rendo-python inspect llm-provider-base-template --json",
                "  rendo-python pull admin-surface-base-template --output ./admin-surface",
            ]
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    help_parser = subparsers.add_parser("help", help="Show CLI help or command help")
    help_parser.add_argument("topic", nargs="?")

    init_parser = subparsers.add_parser("init", help="Initialize a core template in a target directory")
    init_parser.add_argument("kind")
    init_parser.add_argument("target_dir", nargs="?")
    init_parser.add_argument("--output")
    init_parser.add_argument("--runtime", default="source")
    init_parser.add_argument("--json", action="store_true")

    create_parser = subparsers.add_parser("create", help="Create a project from a Starter Template")
    create_parser.add_argument("first", nargs="?")
    create_parser.add_argument("second", nargs="?")
    create_parser.add_argument("--starter")
    create_parser.add_argument("--from", dest="from_url")
    create_parser.add_argument("--runtime")
    create_parser.add_argument("--output")
    create_parser.add_argument("--surfaces")
    create_parser.add_argument("--json", action="store_true")

    search_parser = subparsers.add_parser("search", help="Search templates and packs")
    search_parser.add_argument("--type", default="all")
    search_parser.add_argument("--keyword", default="")
    search_parser.add_argument("--json", action="store_true")

    inspect_parser = subparsers.add_parser("inspect", help="Inspect a template or pack manifest")
    inspect_parser.add_argument("ref")
    inspect_parser.add_argument("--json", action="store_true")

    add_parser = subparsers.add_parser("add", help="Add a pack to the current project")
    add_parser.add_argument("pack_ref")
    add_parser.add_argument("--json", action="store_true")

    pull_parser = subparsers.add_parser("pull", help="Pull a template asset or pack into a local directory")
    pull_parser.add_argument("ref")
    pull_parser.add_argument("--output")
    pull_parser.add_argument("--json", action="store_true")

    upgrade_parser = subparsers.add_parser("upgrade", help="Upgrade installed packs in the current project")
    upgrade_parser.add_argument("pack_ref", nargs="?")
    upgrade_parser.add_argument("--json", action="store_true")

    doctor_parser = subparsers.add_parser("doctor", help="Diagnose local tooling and current project state")
    doctor_parser.add_argument("--json", action="store_true")

    args = parser.parse_args()

    try:
        if args.command == "help":
            if args.topic:
                parser.parse_args([args.topic, "--help"])
            else:
                parser.print_help()
            return

        if args.command == "init":
            starter = resolve_core_template_ref(args.kind)
            if starter is None:
                raise RuntimeError(f"core template is missing from registry for {args.kind}")
            target_dir = args.output or args.target_dir or "."
            _emit(scaffold_template(starter, target_dir, args.runtime), args.json)
            return

        if args.command == "create":
            starter, target_dir = _resolve_create_args(args)
            manifest = load_template_manifest(starter)
            if manifest["templateKind"] != "starter-template":
                raise RuntimeError(f"rendo create only accepts starter templates. Use rendo add or rendo pull for {manifest['id']}.")
            if manifest["templateRole"] == "core":
                raise RuntimeError(f"rendo create does not accept core starter templates. Use rendo init starter for {manifest['id']}.")
            selected_surfaces = [item.strip() for item in args.surfaces.split(",") if item.strip()] if args.surfaces else None
            _emit(scaffold_template(starter, target_dir, args.runtime, selected_surfaces), args.json)
            return

        if args.command == "search":
            _emit(search_registry(args.type, args.keyword), args.json)
            return

        if args.command == "inspect":
            _emit(_inspect(args.ref), args.json)
            return

        if args.command == "add":
            template = resolve_template_ref(args.pack_ref)
            if template and template["templateKind"] != "starter-template":
                project_root = find_project_root(Path.cwd())
                if not project_root:
                    raise RuntimeError("current directory is not inside a rendo project")
                _emit({"applied": True, **install_template_asset(template, project_root)}, args.json)
                return
            pack = resolve_pack_ref(args.pack_ref)
            if pack is None:
                raise RuntimeError(f"pack not found: {args.pack_ref}")
            raise RuntimeError("pack installation is not enabled in the current registry phase")

        if args.command == "pull":
            template = resolve_template_ref(args.ref)
            if template:
                output = Path(args.output or ".").resolve()
                copied_files = copy_template_asset(REPO_ROOT / template["templatePath"], output)
                _emit({"kind": template["templateKind"], "templateId": template["id"], "targetDir": str(output), "copiedFiles": copied_files}, args.json)
                return
            pack = resolve_pack_ref(args.ref)
            if pack:
                _emit({"kind": "pack", "target": str(Path(args.output or ".rendo-pulled") / pack["name"]), "manifest": load_pack_manifest(pack)}, args.json)
                return
            raise RuntimeError(f"unable to resolve ref: {args.ref}")

        if args.command == "upgrade":
            project_root = find_project_root(Path.cwd())
            if not project_root:
                raise RuntimeError("current directory is not inside a rendo project")
            project, _ = load_project_state(project_root)
            if not project["installedPacks"]:
                raise RuntimeError("no packs installed in project")
            raise RuntimeError("pack upgrade is not enabled in the current registry phase")

        if args.command == "doctor":
            _emit(run_doctor(Path.cwd()), args.json)
            return
    except Exception as exc:  # noqa: BLE001
        print(f"rendo error: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
