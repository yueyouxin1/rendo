import { createHash } from "node:crypto";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { mkdtemp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { createTemplateBundle, serializeTemplateBundle, computeBundleDigest } from "../cli/node/src/bundle.js";

const repoRoot = process.cwd();
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const tsxLoader = pathToFileURL(path.join(repoRoot, "node_modules", "tsx", "dist", "loader.mjs")).href;
let generatedAssetsPromise: Promise<void> | null = null;

function run(command: string, args: string[], cwd = repoRoot, extraEnv: Record<string, string> = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function runNodeCli(args: string[], cwd = repoRoot, extraEnv: Record<string, string> = {}) {
  return run("node", ["--import", tsxLoader, path.join(repoRoot, "cli/node/src/bin.ts"), ...args], cwd, extraEnv);
}

function runPythonCli(args: string[], cwd = repoRoot, extraEnv: Record<string, string> = {}) {
  return run("python", [path.join(repoRoot, "cli", "python", "rendo.py"), ...args], cwd, extraEnv);
}

async function ensureGeneratedAssets() {
  if (!generatedAssetsPromise) {
    generatedAssetsPromise = (async () => {
      const profiles = [
        "base/starter/application/application-base-starter",
        "base/feature/dashboard/dashboard-feature-base-template",
        "base/capability/storage/storage-capability-base-template",
        "base/provider/llm/llm-provider-base-template",
        "base/surface/admin/admin-surface-base-template"
      ];
      for (const profile of profiles) {
        const generated = run(npmCommand, ["run", "generate:template", "--", profile], repoRoot);
        assert.equal(generated.status, 0, generated.stderr || generated.stdout);
      }
    })();
  }
  await generatedAssetsPromise;
}

async function withTempDir(name: string, fn: (dir: string) => Promise<void>, options?: { cleanup?: boolean }) {
  const dir = await mkdtemp(path.join(os.tmpdir(), `${name}-`));
  try {
    await fn(dir);
  } finally {
    if (options?.cleanup === false) {
      return;
    }
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        await rm(dir, { recursive: true, force: true });
        break;
      } catch (error) {
        if (attempt === 4) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }
}

async function collectDirectoryHashes(rootDir: string) {
  const result = new Map<string, string>();

  async function visit(current: string) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
      } else {
        const relativePath = path.relative(rootDir, fullPath).replaceAll("\\", "/");
        const content = await readFile(fullPath);
        const digest = createHash("sha256").update(content).digest("hex");
        result.set(relativePath, digest);
      }
    }
  }

  await visit(rootDir);
  return result;
}

async function waitForHttp(
  url: string,
  matcher?: (text: string) => boolean,
  timeoutMs = 120_000,
  init?: RequestInit,
) {
  const startedAt = Date.now();
  let lastError = "request did not complete";

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, init);
      const text = await response.text();
      if (response.ok && (!matcher || matcher(text))) {
        return text;
      }
      lastError = `unexpected response: ${response.status} ${text}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error(`timed out waiting for ${url}: ${lastError}`);
}

function startProcess(command: string, args: string[], cwd: string, extraEnv: Record<string, string> = {}) {
  const child = spawn(
    process.platform === "win32" && command.endsWith(".cmd") ? "cmd.exe" : command,
    process.platform === "win32" && command.endsWith(".cmd") ? ["/d", "/s", "/c", command, ...args] : args,
    {
      cwd,
      shell: false,
      windowsHide: true,
      stdio: "pipe",
      env: {
        ...process.env,
        ...extraEnv,
      },
    },
  );

  let output = "";
  child.stdout?.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr?.on("data", (chunk) => {
    output += chunk.toString();
  });

  return {
    child,
    getOutput: () => output,
  };
}

async function stopProcess(child: ChildProcess) {
  if (child.exitCode !== null) {
    return;
  }

  if (process.platform === "win32" && child.pid) {
    run("taskkill", ["/PID", String(child.pid), "/T", "/F"]);
  } else {
    child.kill("SIGTERM");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (child.exitCode === null) {
      child.kill("SIGKILL");
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));
}

async function runLocallyWebOnlyTemplate(templateDir: string, webPort: number, textToMatch: RegExp) {
  const webDir = path.join(templateDir, "apps", "web");
  const webInstall = run(npmCommand, ["install"], webDir);
  assert.equal(webInstall.status, 0, webInstall.stderr || webInstall.stdout);

  const webProcess = startProcess(
    npxCommand,
    ["next", "dev", "--hostname", "127.0.0.1", "--port", String(webPort)],
    webDir,
  );

  try {
    const webHealth = await waitForHttp(`http://127.0.0.1:${webPort}/api/health`, (text) => text.includes("next-web"));
    const homePage = await waitForHttp(`http://127.0.0.1:${webPort}`, (text) => textToMatch.test(text));
    assert.match(webHealth, /next-web/);
    assert.match(homePage, textToMatch);
  } finally {
    await stopProcess(webProcess.child);
  }
}

async function startFixtureRegistryServer(tamperDigest = false) {
  const registryRaw = JSON.parse(await readFile(path.join(repoRoot, "shared", "registry", "templates.json"), "utf8")) as {
    templates: Array<{ id: string; ref: string; aliases: string[]; official: boolean; templateKind: string; templateRole: string; templatePath: string }>;
  };
  const bundles = new Map<string, { entry: (typeof registryRaw.templates)[number]; bundle: Awaited<ReturnType<typeof createTemplateBundle>>; raw: Buffer; digest: ReturnType<typeof computeBundleDigest> }>();
  for (const entry of registryRaw.templates.filter((item) => item.official)) {
    const templateDir = path.join(repoRoot, entry.templatePath);
    const bundle = await createTemplateBundle(templateDir);
    const raw = serializeTemplateBundle(bundle);
    bundles.set(entry.id, {
      entry,
      bundle,
      raw,
      digest: computeBundleDigest(raw),
    });
  }

  const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const registryId = tamperDigest ? "tampered-registry" : "fixture-registry";
    if (url.pathname === "/.well-known/rendo-registry.json") {
      response.setHeader("content-type", "application/json; charset=utf-8");
      response.end(
        JSON.stringify({
          schemaVersion: "1.0.0",
          protocolVersion: "1.0.0",
          registryId,
          registryTitle: tamperDigest ? "Tampered Registry" : "Fixture Registry",
          apiBaseUrl: "http://127.0.0.1",
          auth: {
            type: "none",
            header: "Authorization",
            scheme: null,
          },
          cliCompatibility: {
            min: "0.2.0",
            max: null,
          },
          bundleFormat: "rendo-bundle.v1",
          digestAlgorithm: "sha256",
        }),
      );
      return;
    }

    if (url.pathname === "/v1/search") {
      response.setHeader("content-type", "application/json; charset=utf-8");
      response.end(
        JSON.stringify({
          registry: {
            id: registryId,
            protocolVersion: "1.0.0",
          },
          results: [...bundles.values()].map(({ bundle }) => ({
            kind: bundle.manifest.templateKind,
            id: bundle.manifest.id,
            title: bundle.manifest.title,
            version: bundle.manifest.version,
            category: bundle.manifest.category,
            templateKind: bundle.manifest.templateKind,
            templateRole: bundle.manifest.templateRole,
            official: true,
          })),
        }),
      );
      return;
    }

    if (url.pathname === "/v1/inspect") {
      const ref = url.searchParams.get("ref")?.toLowerCase() ?? "";
      const matched = [...bundles.values()].find(({ entry }) =>
        [entry.id, entry.ref, ...entry.aliases].some((candidate) => candidate.toLowerCase() === ref),
      );
      if (!matched) {
        response.statusCode = 404;
        response.end(JSON.stringify({ error: `template not found: ${ref}` }));
        return;
      }
      response.setHeader("content-type", "application/json; charset=utf-8");
      response.end(
        JSON.stringify({
          registry: {
            id: registryId,
            protocolVersion: "1.0.0",
          },
          payload: {
            kind: matched.bundle.manifest.templateKind,
            id: matched.bundle.manifest.id,
            title: matched.bundle.manifest.title,
            version: matched.bundle.manifest.version,
            type: matched.bundle.manifest.type,
            templateKind: matched.bundle.manifest.templateKind,
            templateRole: matched.bundle.manifest.templateRole,
            description: matched.bundle.manifest.description,
            category: matched.bundle.manifest.category,
            uiMode: matched.bundle.manifest.uiMode,
            domainTags: matched.bundle.manifest.domainTags,
            scenarioTags: matched.bundle.manifest.scenarioTags,
            toolchains: matched.bundle.manifest.toolchains,
            surfaceCapabilities: matched.bundle.manifest.surfaceCapabilities,
            defaultSurfaces: matched.bundle.manifest.defaultSurfaces,
            runtimeModes: matched.bundle.manifest.runtimeModes,
            requiredEnv: matched.bundle.manifest.requiredEnv,
            dependencies: matched.bundle.manifest.recommendedPacks,
            official: true,
            compatibility: matched.bundle.manifest.compatibility,
            assetInstall: matched.bundle.manifest.assetInstall,
          },
          manifest: matched.bundle.manifest,
          bundle: {
            url: `/v1/bundles/${matched.entry.id}`,
            digest: {
              algorithm: "sha256",
              value: tamperDigest ? `${matched.digest.value.slice(0, -1)}0` : matched.digest.value,
            },
            templateDigest: matched.bundle.templateDigest,
            bundleFormat: "rendo-bundle.v1",
          },
        }),
      );
      return;
    }

    if (url.pathname.startsWith("/v1/bundles/")) {
      const templateId = url.pathname.split("/").pop() ?? "";
      const matched = bundles.get(templateId);
      if (!matched) {
        response.statusCode = 404;
        response.end("not found");
        return;
      }
      response.setHeader("content-type", "application/json; charset=utf-8");
      response.end(matched.raw);
      return;
    }

    response.statusCode = 404;
    response.end("not found");
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: async () => {
      await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    },
  };
}

test("node and python CLIs expose identical template search results", async () => {
  await ensureGeneratedAssets();
  const nodeSearch = runNodeCli(["search", "--type", "all", "--json"]);
  const pythonSearch = runPythonCli(["search", "--type", "all", "--json"]);

  assert.equal(nodeSearch.status, 0, nodeSearch.stderr);
  assert.equal(pythonSearch.status, 0, pythonSearch.stderr);

  assert.deepEqual(JSON.parse(nodeSearch.stdout), JSON.parse(pythonSearch.stdout));
  const payload = JSON.parse(nodeSearch.stdout) as Array<{ id: string; templateKind: string; templateRole: string }>;
  const starterCore = payload.find((item) => item.id === "starter-core-template");
  assert.equal(starterCore?.templateKind, "starter-template");
  assert.equal(starterCore?.templateRole, "core");
  const application = payload.find((item) => item.id === "application-base-starter");
  assert.equal(application?.templateKind, "starter-template");
  assert.equal(application?.templateRole, "base");
  const feature = payload.find((item) => item.id === "dashboard-feature-base-template");
  assert.equal(feature?.templateKind, "feature-template");
  assert.equal(feature?.templateRole, "base");
  const capability = payload.find((item) => item.id === "storage-capability-base-template");
  assert.equal(capability?.templateKind, "capability-template");
  assert.equal(capability?.templateRole, "base");
  const provider = payload.find((item) => item.id === "llm-provider-base-template");
  assert.equal(provider?.templateKind, "provider-template");
  assert.equal(provider?.templateRole, "base");
  const surface = payload.find((item) => item.id === "admin-surface-base-template");
  assert.equal(surface?.templateKind, "surface-template");
  assert.equal(surface?.templateRole, "base");
});

test("node and python CLIs expose identical inspect payload for application base starter", async () => {
  await ensureGeneratedAssets();
  const nodeInspect = runNodeCli(["inspect", "application-base-starter", "--json"]);
  const pythonInspect = runPythonCli(["inspect", "application-base-starter", "--json"]);

  assert.equal(nodeInspect.status, 0, nodeInspect.stderr);
  assert.equal(pythonInspect.status, 0, pythonInspect.stderr);

  assert.deepEqual(JSON.parse(nodeInspect.stdout), JSON.parse(pythonInspect.stdout));
  const payload = JSON.parse(nodeInspect.stdout) as {
    templateKind: string;
    templateRole: string;
    domainTags: string[];
    scenarioTags: string[];
    surfaceCapabilities: string[];
    defaultSurfaces: string[];
  };
  assert.equal(payload.templateKind, "starter-template");
  assert.equal(payload.templateRole, "base");
  assert.deepEqual(payload.domainTags, ["developer-tool", "productivity"]);
  assert.deepEqual(payload.scenarioTags, []);
  assert.deepEqual(payload.surfaceCapabilities, ["web", "miniapp", "mobile"]);
  assert.deepEqual(payload.defaultSurfaces, ["web"]);
});

test("node and python CLIs expose identical inspect payload for provider base template", async () => {
  await ensureGeneratedAssets();
  const nodeInspect = runNodeCli(["inspect", "llm-provider-base-template", "--json"]);
  const pythonInspect = runPythonCli(["inspect", "llm-provider-base-template", "--json"]);

  assert.equal(nodeInspect.status, 0, nodeInspect.stderr);
  assert.equal(pythonInspect.status, 0, pythonInspect.stderr);

  assert.deepEqual(JSON.parse(nodeInspect.stdout), JSON.parse(pythonInspect.stdout));
  const payload = JSON.parse(nodeInspect.stdout) as { templateKind: string; templateRole: string; domainTags: string[] };
  assert.equal(payload.templateKind, "provider-template");
  assert.equal(payload.templateRole, "base");
  assert.deepEqual(payload.domainTags, ["llm-provider"]);
});

test("template authoring pipeline generates application base starter from profile", async () => {
  await ensureGeneratedAssets();
  const generated = run(
    "node",
    ["--import", "tsx", "scripts/generate-template.ts", "base/starter/application/application-base-starter"],
    repoRoot,
  );
  assert.equal(generated.status, 0, generated.stderr);

  const generatedPayload = JSON.parse(generated.stdout) as { profileId: string; templateId: string };
  assert.equal(generatedPayload.profileId, "base/starter/application/application-base-starter");
  assert.equal(generatedPayload.templateId, "application-base-starter");

  const templateManifest = JSON.parse(
    await readFile(path.join(repoRoot, "shared", "templates", "base", "starter", "application-base-starter", "rendo.template.json"), "utf8"),
  ) as { id: string; type: string; category: string; templateKind: string; templateRole: string };
  assert.equal(templateManifest.id, "application-base-starter");
  assert.equal(templateManifest.type, "template");
  assert.equal(templateManifest.templateKind, "starter-template");
  assert.equal(templateManifest.templateRole, "base");
  assert.equal(templateManifest.category, "application");
});

test("core templates stay aligned with the shared skeleton", async () => {
  const checked = run("node", ["--import", "tsx", "scripts/sync-core-templates.ts", "--check"], repoRoot);
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
});

test("rendo init creates runnable core templates for every template kind", async () => {
  await ensureGeneratedAssets();
  await withTempDir("rendo-core", async (dir) => {
    const kinds = ["starter", "feature", "capability", "provider", "surface"] as const;
    for (const kind of kinds) {
      const target = path.join(dir, `${kind}-core`);
      const init = runNodeCli(["init", kind, "--output", target, "--json"], repoRoot);
      assert.equal(init.status, 0, init.stderr);

      const templateManifest = JSON.parse(await readFile(path.join(target, "rendo.template.json"), "utf8")) as {
        id: string;
        type: string;
        templateRole: string;
      };
      assert.equal(templateManifest.id, `${kind}-core-template`);
      assert.equal(templateManifest.type, "template");
      assert.equal(templateManifest.templateRole, "core");

      const install = run(npmCommand, ["install"], target);
      assert.equal(install.status, 0, install.stderr);

      const health = run(npmCommand, ["run", "health"], target);
      assert.equal(health.status, 0, health.stderr);
      assert.match(health.stdout, new RegExp(`"templateId": "${kind}-core-template"`));
    }
  });
});

test("rendo create rejects core starter and creates identical multi-surface application projects", async () => {
  await ensureGeneratedAssets();
  const rejected = runNodeCli(["create", "starter-core-template", "ignored-dir"], repoRoot);
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /rendo init starter/);

  await withTempDir("rendo-application", async (dir) => {
    const createdAt = "2026-04-04T00:00:00.000Z";
    const nodeTarget = path.join(dir, "node", "application-app");
    const pythonTarget = path.join(dir, "python", "application-app");
    const nodeCreate = runNodeCli(
      ["create", "application", "--output", nodeTarget, "--surfaces", "web,miniapp", "--json"],
      repoRoot,
      { RENDO_CREATED_AT_OVERRIDE: createdAt },
    );
    const pythonCreate = runPythonCli(
      ["create", "application", "--output", pythonTarget, "--surfaces", "web,miniapp", "--json"],
      repoRoot,
      { RENDO_CREATED_AT_OVERRIDE: createdAt },
    );
    assert.equal(nodeCreate.status, 0, nodeCreate.stderr);
    assert.equal(pythonCreate.status, 0, pythonCreate.stderr);

    const templateManifest = JSON.parse(await readFile(path.join(nodeTarget, "rendo.template.json"), "utf8")) as {
      id: string;
      type: string;
      templateRole: string;
    };
    assert.equal(templateManifest.id, "application-base-starter");
    assert.equal(templateManifest.type, "template");
    assert.equal(templateManifest.templateRole, "base");

    const projectManifest = JSON.parse(await readFile(path.join(nodeTarget, "rendo.project.json"), "utf8")) as {
      surfaces: string[];
      template: { id: string };
    };
    assert.deepEqual(projectManifest.surfaces, ["web", "miniapp"]);
    assert.equal(projectManifest.template.id, "application-base-starter");
    assert.ok(run("cmd", ["/c", "if exist apps\\miniapp (exit 0) else (exit 1)"], nodeTarget).status === 0);
    assert.ok(run("cmd", ["/c", "if exist apps\\mobile (exit 0) else (exit 1)"], nodeTarget).status !== 0);

    const nodeHashes = await collectDirectoryHashes(nodeTarget);
    const pythonHashes = await collectDirectoryHashes(pythonTarget);
    assert.deepEqual([...nodeHashes.entries()].sort(), [...pythonHashes.entries()].sort());

    await runLocallyWebOnlyTemplate(nodeTarget, 3200, /Multi-surface hello world, one canonical application base/);
  });
});

test("node and python CLIs add identical provider template assets into a project", async () => {
  await ensureGeneratedAssets();
  await withTempDir("rendo-provider-add", async (dir) => {
    const createdAt = "2026-04-04T00:00:00.000Z";
    const nodeTarget = path.join(dir, "node", "application-app");
    const pythonTarget = path.join(dir, "python", "application-app");

    const nodeCreate = runNodeCli(
      ["create", "application", "--output", nodeTarget, "--surfaces", "web", "--json"],
      repoRoot,
      { RENDO_CREATED_AT_OVERRIDE: createdAt },
    );
    const pythonCreate = runPythonCli(
      ["create", "application", "--output", pythonTarget, "--surfaces", "web", "--json"],
      repoRoot,
      { RENDO_CREATED_AT_OVERRIDE: createdAt },
    );
    assert.equal(nodeCreate.status, 0, nodeCreate.stderr);
    assert.equal(pythonCreate.status, 0, pythonCreate.stderr);

    const nodeAdd = runNodeCli(
      ["add", "llm-provider-base-template", "--json"],
      nodeTarget,
      { RENDO_INSTALLED_AT_OVERRIDE: "2026-04-04T00:00:00.000Z" },
    );
    const pythonAdd = runPythonCli(
      ["add", "llm-provider-base-template", "--json"],
      pythonTarget,
      { RENDO_INSTALLED_AT_OVERRIDE: "2026-04-04T00:00:00.000Z" },
    );
    assert.equal(nodeAdd.status, 0, nodeAdd.stderr);
    assert.equal(pythonAdd.status, 0, pythonAdd.stderr);

    const nodeHashes = await collectDirectoryHashes(nodeTarget);
    const pythonHashes = await collectDirectoryHashes(pythonTarget);
    assert.deepEqual([...nodeHashes.entries()].sort(), [...pythonHashes.entries()].sort());

    const nodeProject = JSON.parse(await readFile(path.join(nodeTarget, "rendo.project.json"), "utf8")) as {
      installedTemplates: Array<{ id: string; templateKind: string }>;
    };
    assert.ok(nodeProject.installedTemplates.some((item) => item.id === "llm-provider-base-template" && item.templateKind === "provider-template"));
  });
});

test("node and python CLIs pull identical provider template assets with --output", async () => {
  await ensureGeneratedAssets();
  await withTempDir("rendo-provider-pull", async (dir) => {
    const nodeTarget = path.join(dir, "node", "provider-template");
    const pythonTarget = path.join(dir, "python", "provider-template");

    const nodePull = runNodeCli(["pull", "llm-provider-base-template", "--output", nodeTarget, "--json"], repoRoot);
    const pythonPull = runPythonCli(["pull", "llm-provider-base-template", "--output", pythonTarget, "--json"], repoRoot);

    assert.equal(nodePull.status, 0, nodePull.stderr);
    assert.equal(pythonPull.status, 0, pythonPull.stderr);

    const nodeHashes = await collectDirectoryHashes(nodeTarget);
    const pythonHashes = await collectDirectoryHashes(pythonTarget);
    assert.deepEqual([...nodeHashes.entries()].sort(), [...pythonHashes.entries()].sort());
  });
});

test("node and python CLIs consume identical remote registry output from the fixture server", async () => {
  await ensureGeneratedAssets();
  const registry = await startFixtureRegistryServer();
  try {
    const createdAt = "2026-04-04T00:00:00.000Z";
    await withTempDir("rendo-remote-fixture", async (dir) => {
      const nodeSearch = runNodeCli(["search", "--type", "all", "--registry", registry.baseUrl, "--json"], repoRoot);
      const pythonSearch = runPythonCli(["search", "--type", "all", "--registry", registry.baseUrl, "--json"], repoRoot);
      assert.equal(nodeSearch.status, 0, nodeSearch.stderr);
      assert.equal(pythonSearch.status, 0, pythonSearch.stderr);
      assert.deepEqual(JSON.parse(nodeSearch.stdout), JSON.parse(pythonSearch.stdout));

      const nodeInspect = runNodeCli(["inspect", "application-base-starter", "--registry", registry.baseUrl, "--json"], repoRoot);
      const pythonInspect = runPythonCli(["inspect", "application-base-starter", "--registry", registry.baseUrl, "--json"], repoRoot);
      assert.equal(nodeInspect.status, 0, nodeInspect.stderr);
      assert.equal(pythonInspect.status, 0, pythonInspect.stderr);
      assert.deepEqual(JSON.parse(nodeInspect.stdout), JSON.parse(pythonInspect.stdout));

      const nodeApp = path.join(dir, "node-app");
      const pythonApp = path.join(dir, "python-app");
      const nodeCreate = runNodeCli(
        ["create", "application-base-starter", "--registry", registry.baseUrl, "--output", nodeApp, "--surfaces", "web", "--json"],
        repoRoot,
        { RENDO_CREATED_AT_OVERRIDE: createdAt },
      );
      const pythonCreate = runPythonCli(
        ["create", "application-base-starter", "--registry", registry.baseUrl, "--output", pythonApp, "--surfaces", "web", "--json"],
        repoRoot,
        { RENDO_CREATED_AT_OVERRIDE: createdAt },
      );
      assert.equal(nodeCreate.status, 0, nodeCreate.stderr);
      assert.equal(pythonCreate.status, 0, pythonCreate.stderr);

      const nodeAdd = runNodeCli(
        ["add", "llm-provider-base-template", "--registry", registry.baseUrl, "--json"],
        nodeApp,
        { RENDO_INSTALLED_AT_OVERRIDE: "2026-04-04T00:00:00.000Z" },
      );
      const pythonAdd = runPythonCli(
        ["add", "llm-provider-base-template", "--registry", registry.baseUrl, "--json"],
        pythonApp,
        { RENDO_INSTALLED_AT_OVERRIDE: "2026-04-04T00:00:00.000Z" },
      );
      assert.equal(nodeAdd.status, 0, nodeAdd.stderr);
      assert.equal(pythonAdd.status, 0, pythonAdd.stderr);

      const nodeHashes = await collectDirectoryHashes(nodeApp);
      const pythonHashes = await collectDirectoryHashes(pythonApp);
      assert.deepEqual([...nodeHashes.entries()].sort(), [...pythonHashes.entries()].sort());
    });
  } finally {
    await registry.close();
  }
});

test("remote pull fails when registry advertises a wrong bundle digest", async () => {
  await ensureGeneratedAssets();
  const registry = await startFixtureRegistryServer(true);
  try {
    await withTempDir("rendo-remote-digest", async (dir) => {
      const nodePull = runNodeCli(
        ["pull", "application-base-starter", "--registry", registry.baseUrl, "--output", path.join(dir, "node"), "--json"],
        repoRoot,
      );
      const pythonPull = runPythonCli(
        ["pull", "application-base-starter", "--registry", registry.baseUrl, "--output", path.join(dir, "python"), "--json"],
        repoRoot,
      );

      assert.notEqual(nodePull.status, 0);
      assert.match(nodePull.stderr, /digest mismatch/);
      assert.notEqual(pythonPull.status, 0);
      assert.match(pythonPull.stderr, /digest mismatch/);
    });
  } finally {
    await registry.close();
  }
});
