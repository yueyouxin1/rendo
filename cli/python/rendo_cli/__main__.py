from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .doctor import run_doctor
from .packs import install_pack, preview_pack, upgrade_packs
from .project import find_project_root
from .registry_client import (
    get_registry_handshake,
    inspect_registry_ref,
    load_pack_manifest,
    prepare_core_template_source,
    prepare_starter_template_source,
    prepare_template_source,
    resolve_pack_ref,
    search_registry,
)
from .scaffold import scaffold_template
from .fs import copy_template_asset
from .template_assets import install_template_asset, preview_template_asset_install, upgrade_template_assets
from .version import CLI_VERSION


def _emit(payload, as_json: bool) -> None:
    if as_json:
        print(json.dumps(payload, indent=2))
    else:
        print(payload)


def _print_inspect(payload: dict, as_json: bool) -> None:
    if as_json:
        _emit(payload, True)
        return
    print(f"{payload['kind']}: {payload['id']}")
    print(f"title: {payload['title']}")
    print(f"version: {payload['version']}")
    print(f"type: {payload['type']}")
    if payload.get("templateKind"):
        print(f"template kind: {payload['templateKind']}")
    if payload.get("templateRole"):
        print(f"template role: {payload['templateRole']}")
    print(f"description: {payload['description']}")
    if payload.get("category"):
        print(f"category: {payload['category']}")
    if payload.get("uiMode"):
        print(f"ui mode: {payload['uiMode']}")
    if payload.get("domainTags"):
        print(f"domain tags: {', '.join(payload['domainTags'])}")
    if payload.get("scenarioTags"):
        print(f"scenario tags: {', '.join(payload['scenarioTags'])}")
    if payload.get("toolchains"):
        print(
            "toolchains: "
            + ", ".join(f"{item['name']}@{item['version']} ({item['role']})" for item in payload["toolchains"])
        )
    if payload.get("documentation"):
        print(f"docs overview: {payload['documentation']['overview']}")
        print(f"docs structure: {payload['documentation']['structure']}")
        print(f"docs extension points: {payload['documentation']['extensionPoints']}")
        print(f"docs inheritance: {payload['documentation']['inheritanceBoundaries']}")
        print(f"docs secondary development: {payload['documentation']['secondaryDevelopment']}")
    if payload.get("surfaceCapabilities"):
        print(f"surface capabilities: {', '.join(payload['surfaceCapabilities'])}")
    if payload.get("defaultSurfaces"):
        print(f"default surfaces: {', '.join(payload['defaultSurfaces'])}")
    if payload.get("runtimeModes"):
        print(f"runtime modes: {', '.join(payload['runtimeModes'])}")
    if payload.get("runtimeMode"):
        print(f"runtime mode: {payload['runtimeMode']}")
    if payload.get("provider"):
        print(f"provider: {payload['provider']}")
    print(f"official: {'yes' if payload['official'] else 'no'}")
    print(f"required env: {', '.join(payload['requiredEnv']) if payload['requiredEnv'] else '(none)'}")
    print(f"dependencies: {', '.join(payload['dependencies']) if payload['dependencies'] else '(none)'}")
    if payload.get("compatibility"):
        print(
            "compatibility: "
            f"cli {payload['compatibility']['cli']['min'] or '*'}..{payload['compatibility']['cli']['max'] or '*'}, "
            f"registry {payload['compatibility']['registryProtocol']['min'] or '*'}..{payload['compatibility']['registryProtocol']['max'] or '*'}"
        )
    if payload.get("assetInstall"):
        print(f"install summary: {payload['assetInstall']['previewSummary']}")
        hosts = payload["assetInstall"]["supportedHostTemplates"]
        host_kinds = payload["assetInstall"]["supportedHostKinds"]
        supported_hosts = ", ".join(hosts) if hosts else ", ".join(host_kinds) if host_kinds else "(any)"
        print(f"supported hosts: {supported_hosts}")
        for mode in payload["assetInstall"]["modes"]:
            print(
                f"  mode {mode['runtimeMode']}: target {mode['targetRoot']}, "
                f"conflict {mode['conflictStrategy']}, rollback {mode['rollbackStrategy']}"
            )
    if payload.get("install"):
        print("install plan:")
        print(f"  adds files: {', '.join(payload['install']['addsFiles']) if payload['install']['addsFiles'] else '(none)'}")
        print(
            f"  updates files: {', '.join(payload['install']['updatesFiles']) if payload['install']['updatesFiles'] else '(none)'}"
        )
        print(f"  adds env: {', '.join(payload['install']['addsEnv']) if payload['install']['addsEnv'] else '(none)'}")


def _registry_options(args) -> dict:
    return {
        "registry": getattr(args, "registry", None),
        "registryToken": getattr(args, "registry_token", None),
    }


def _resolve_create_args(args) -> tuple[str, str]:
    starter_ref = args.from_url or args.starter
    target_dir = args.output
    if not starter_ref and args.first and args.second:
        starter_ref = args.first
        target_dir = target_dir or args.second
    elif not starter_ref and args.first:
        starter_ref = args.first
    if not starter_ref:
        starter_ref = input("Starter ref (for example: rendo:application-base-starter): ").strip()
    return starter_ref, target_dir or "."


def _pull_template_ref(ref: str, output_dir: str | None, as_json: bool, registry_options: dict) -> None:
    source = prepare_template_source(ref, registry_options)
    if source:
        try:
            target = Path(output_dir or ".").resolve()
            copied_files = copy_template_asset(source["templateDir"], target)
            _emit(
                {
                    "kind": source["manifest"]["templateKind"],
                    "templateId": source["manifest"]["id"],
                    "targetDir": str(target),
                    "copiedFiles": copied_files,
                    "registry": source["registry"],
                    "source": source["source"],
                    "bundleDigest": source["bundleDigest"],
                },
                as_json,
            )
            return
        finally:
            source["cleanup"]()
    pack = resolve_pack_ref(ref, registry_options)
    if pack:
        _emit({"kind": "pack", "target": str(Path(output_dir or ".").resolve()), "manifest": preview_pack(pack)}, as_json)
        return
    raise RuntimeError(f"unable to resolve ref: {ref}")


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="rendo-python",
        description="Rendo starter and template control plane",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--version", action="version", version=CLI_VERSION)
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_parser = subparsers.add_parser("init", help="Initialize a core template in a target directory")
    init_parser.add_argument("kind")
    init_parser.add_argument("target_dir", nargs="?")
    init_parser.add_argument("--output")
    init_parser.add_argument("--runtime", default="source")
    init_parser.add_argument("--registry", default="local")
    init_parser.add_argument("--registry-token")
    init_parser.add_argument("--json", action="store_true")

    create_parser = subparsers.add_parser("create", help="Create a project from a Starter Template")
    create_parser.add_argument("first", nargs="?")
    create_parser.add_argument("second", nargs="?")
    create_parser.add_argument("--starter")
    create_parser.add_argument("--from", dest="from_url")
    create_parser.add_argument("--runtime")
    create_parser.add_argument("--output")
    create_parser.add_argument("--surfaces")
    create_parser.add_argument("--registry", default="local")
    create_parser.add_argument("--registry-token")
    create_parser.add_argument("--json", action="store_true")

    search_parser = subparsers.add_parser("search", help="Search templates and packs")
    search_parser.add_argument("--type", default="all")
    search_parser.add_argument("--keyword", default="")
    search_parser.add_argument("--registry", default="local")
    search_parser.add_argument("--registry-token")
    search_parser.add_argument("--json", action="store_true")

    inspect_parser = subparsers.add_parser("inspect", help="Inspect a template or pack manifest")
    inspect_parser.add_argument("ref")
    inspect_parser.add_argument("--registry", default="local")
    inspect_parser.add_argument("--registry-token")
    inspect_parser.add_argument("--json", action="store_true")

    add_parser = subparsers.add_parser("add", help="Add a non-starter template asset or a pack to the current project")
    add_parser.add_argument("ref")
    add_parser.add_argument("--preview", action="store_true")
    add_parser.add_argument("--yes", action="store_true")
    add_parser.add_argument("--registry", default="local")
    add_parser.add_argument("--registry-token")
    add_parser.add_argument("--json", action="store_true")

    pull_parser = subparsers.add_parser("pull", help="Pull a template asset or pack into a local directory")
    pull_parser.add_argument("ref")
    pull_parser.add_argument("--output")
    pull_parser.add_argument("--registry", default="local")
    pull_parser.add_argument("--registry-token")
    pull_parser.add_argument("--json", action="store_true")

    upgrade_parser = subparsers.add_parser("upgrade", help="Upgrade installed template assets or packs in the current project")
    upgrade_parser.add_argument("ref", nargs="?")
    upgrade_parser.add_argument("--preview", action="store_true")
    upgrade_parser.add_argument("--registry", default="local")
    upgrade_parser.add_argument("--registry-token")
    upgrade_parser.add_argument("--json", action="store_true")

    doctor_parser = subparsers.add_parser("doctor", help="Diagnose local tooling, registry connectivity, and current project state")
    doctor_parser.add_argument("--registry", default="local")
    doctor_parser.add_argument("--registry-token")
    doctor_parser.add_argument("--json", action="store_true")

    args = parser.parse_args()

    try:
        if args.command == "init":
            source = prepare_core_template_source(args.kind, _registry_options(args))
            if source is None:
                raise RuntimeError(f"core template is missing from registry for {args.kind}")
            try:
                target_dir = args.output or args.target_dir or "."
                _emit({**scaffold_template(source, target_dir, args.runtime), "registry": source["registry"], "source": source["source"]}, args.json)
            finally:
                source["cleanup"]()
            return

        if args.command == "create":
            starter_ref, target_dir = _resolve_create_args(args)
            source = prepare_starter_template_source(starter_ref, _registry_options(args))
            if source is None:
                raise RuntimeError("starter not found in registry")
            try:
                if source["manifest"]["templateRole"] == "core":
                    raise RuntimeError(
                        f"rendo create does not accept core starter templates. Use rendo init starter for {source['manifest']['id']}."
                    )
                selected_surfaces = [item.strip() for item in args.surfaces.split(",") if item.strip()] if args.surfaces else None
                _emit({**scaffold_template(source, target_dir, args.runtime, selected_surfaces), "registry": source["registry"], "source": source["source"]}, args.json)
            finally:
                source["cleanup"]()
            return

        if args.command == "search":
            _emit(search_registry(args.type, args.keyword, _registry_options(args)), args.json)
            return

        if args.command == "inspect":
            inspected = inspect_registry_ref(args.ref, _registry_options(args))
            _print_inspect(inspected["payload"], args.json)
            return

        if args.command == "add":
            source = prepare_template_source(args.ref, _registry_options(args))
            if source:
                try:
                    if source["manifest"]["templateKind"] == "starter-template":
                        raise RuntimeError(f"rendo add does not accept starter templates. Use rendo create for {source['manifest']['id']}.")
                    project_root = find_project_root(Path.cwd())
                    if not project_root:
                        raise RuntimeError("current directory is not inside a rendo project")
                    preview = preview_template_asset_install(source, project_root)
                    if args.preview:
                        _emit({"applied": False, "preview": preview}, args.json)
                        return
                    _emit({"applied": True, "preview": preview, **install_template_asset(source, project_root)}, args.json)
                    return
                finally:
                    source["cleanup"]()
            pack = resolve_pack_ref(args.ref, _registry_options(args))
            if pack is None:
                raise RuntimeError(f"asset not found: {args.ref}")
            project_root = find_project_root(Path.cwd())
            if not project_root:
                raise RuntimeError("current directory is not inside a rendo project")
            preview = preview_pack(pack)
            if not args.yes:
                answer = input("Apply this install plan? [y/N] ").strip().lower()
                if answer not in {"y", "yes"}:
                    _emit({"applied": False, "preview": preview}, args.json)
                    return
            _emit({"applied": True, **install_pack(pack, project_root)}, args.json)
            return

        if args.command == "pull":
            _pull_template_ref(args.ref, args.output, args.json, _registry_options(args))
            return

        if args.command == "upgrade":
            project_root = find_project_root(Path.cwd())
            if not project_root:
                raise RuntimeError("current directory is not inside a rendo project")
            try:
                template_results = upgrade_template_assets(
                    project_root,
                    {**_registry_options(args), "templateRef": args.ref, "preview": args.preview},
                )
            except RuntimeError as exc:
                if str(exc) in {"no template assets installed in project", f"template is not installed: {args.ref}"}:
                    template_results = []
                else:
                    raise
            if template_results:
                _emit(template_results, args.json)
                return
            _emit(upgrade_packs(project_root, args.ref), args.json)
            return

        if args.command == "doctor":
            _emit({**run_doctor(Path.cwd()), "registry": get_registry_handshake(_registry_options(args))}, args.json)
            return
    except Exception as exc:  # noqa: BLE001
        print(f"rendo error: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
