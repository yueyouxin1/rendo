import { createHash } from "node:crypto";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

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
      const application = run(npmCommand, ["run", "generate:domain-starter", "--", "base/application/application-base"], repoRoot);
      assert.equal(application.status, 0, application.stderr || application.stdout);
      const aiWeb = run(npmCommand, ["run", "generate:domain-starter", "--", "derived/ai-webapp/next-fastapi-landing"], repoRoot);
      assert.equal(aiWeb.status, 0, aiWeb.stderr || aiWeb.stdout);
    })();
  }
  await generatedAssetsPromise;
}

async function withTempDir(name: string, fn: (dir: string) => Promise<void>) {
  const dir = await mkdtemp(path.join(os.tmpdir(), `${name}-`));
  try {
    await fn(dir);
  } finally {
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

async function waitForHttp(url: string, matcher?: (text: string) => boolean, timeoutMs = 120_000) {
  const startedAt = Date.now();
  let lastError = "request did not complete";

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
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

async function runLocallyAiWebTemplate(templateDir: string, apiPort: number, webPort: number) {
  const webDir = path.join(templateDir, "apps", "web");
  const apiDir = path.join(templateDir, "services", "mock-llm");

  const dockerConfig = run("docker", ["compose", "config"], templateDir);
  assert.equal(dockerConfig.status, 0, dockerConfig.stderr || dockerConfig.stdout);

  const webInstall = run(npmCommand, ["install"], webDir);
  assert.equal(webInstall.status, 0, webInstall.stderr || webInstall.stdout);

  const apiInstall = run("python", ["-m", "pip", "install", "--disable-pip-version-check", "-r", "requirements.txt"], apiDir);
  assert.equal(apiInstall.status, 0, apiInstall.stderr || apiInstall.stdout);

  const apiProcess = startProcess("python", ["-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", String(apiPort)], apiDir);
  const webProcess = startProcess(
    npxCommand,
    ["next", "dev", "--hostname", "127.0.0.1", "--port", String(webPort)],
    webDir,
    { NEXT_PUBLIC_LLM_API_BASE_URL: `http://127.0.0.1:${apiPort}` },
  );

  try {
    const apiHealth = await waitForHttp(`http://127.0.0.1:${apiPort}/health`, (text) => text.includes("python-fastapi"));
    const webHealth = await waitForHttp(`http://127.0.0.1:${webPort}/api/health`, (text) => text.includes("next-web"));
    const homePage = await waitForHttp(
      `http://127.0.0.1:${webPort}`,
      (text) => text.includes("Next.js landing page, FastAPI mock LLM, one starter identity."),
    );
    const mockResponse = await fetch(`http://127.0.0.1:${apiPort}/api/mock-llm`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ prompt: "test from integration" }),
    });
    const mockPayload = await mockResponse.json();

    assert.match(apiHealth, /python-fastapi/);
    assert.match(webHealth, /next-web/);
    assert.match(homePage, /Rendo AI Web Starter/);
    assert.equal(mockPayload.runtime, "python-fastapi");
    assert.match(mockPayload.completion, /test from integration/);
  } finally {
    await stopProcess(webProcess.child);
    await stopProcess(apiProcess.child);
  }
}

test("node and python CLIs expose identical template search results", async () => {
  await ensureGeneratedAssets();
  const nodeSearch = runNodeCli(["search", "--type", "all", "--json"]);
  const pythonSearch = runPythonCli(["search", "--type", "all", "--json"]);

  assert.equal(nodeSearch.status, 0, nodeSearch.stderr);
  assert.equal(pythonSearch.status, 0, pythonSearch.stderr);

  assert.deepEqual(JSON.parse(nodeSearch.stdout), JSON.parse(pythonSearch.stdout));
  const payload = JSON.parse(nodeSearch.stdout) as Array<{ id: string; templateKind: string; templateRole: string }>;
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
  const aiWeb = payload.find((item) => item.id === "ai-web-next-fastapi-starter");
  assert.equal(aiWeb?.templateKind, "starter-template");
  assert.equal(aiWeb?.templateRole, "derived");
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

test("domain starter authoring pipeline generates application base starter from profile", async () => {
  await ensureGeneratedAssets();
  const generated = run(
    "node",
    ["--import", "tsx", "scripts/generate-domain-starter.ts", "base/application/application-base"],
    repoRoot,
  );
  assert.equal(generated.status, 0, generated.stderr);

  const generatedPayload = JSON.parse(generated.stdout) as { profileId: string; starterId: string };
  assert.equal(generatedPayload.profileId, "base/application/application-base");
  assert.equal(generatedPayload.starterId, "application-base-starter");

  const templateManifest = JSON.parse(
    await readFile(path.join(repoRoot, "shared", "templates", "base", "starter", "application-base-starter", "rendo.template.json"), "utf8"),
  ) as { id: string; type: string; category: string; templateKind: string; templateRole: string };
  assert.equal(templateManifest.id, "application-base-starter");
  assert.equal(templateManifest.type, "domain-starter");
  assert.equal(templateManifest.templateKind, "starter-template");
  assert.equal(templateManifest.templateRole, "base");
  assert.equal(templateManifest.category, "application");
});

test("rendo init creates a runnable core starter", async () => {
  await ensureGeneratedAssets();
  await withTempDir("rendo-core", async (dir) => {
    const target = path.join(dir, "core-authoring");
    await mkdir(target);
    const init = runNodeCli(["init", "--output", target, "--json"], repoRoot);
    assert.equal(init.status, 0, init.stderr);

    const templateManifest = JSON.parse(await readFile(path.join(target, "rendo.template.json"), "utf8")) as { id: string; type: string };
    assert.equal(templateManifest.id, "core-starter");
    assert.equal(templateManifest.type, "core-starter");

    const install = run(npmCommand, ["install"], target);
    assert.equal(install.status, 0, install.stderr);

    const health = run(npmCommand, ["run", "health"], target);
    assert.equal(health.status, 0, health.stderr);
    assert.match(health.stdout, /"starterId": "core-starter"/);
  });
});

test("rendo create rejects core starter and creates identical multi-surface application projects", async () => {
  await ensureGeneratedAssets();
  const rejected = runNodeCli(["create", "core-starter", "ignored-dir"], repoRoot);
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /Use rendo init/);

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
    assert.equal(templateManifest.type, "domain-starter");
    assert.equal(templateManifest.templateRole, "base");

    const projectManifest = JSON.parse(await readFile(path.join(nodeTarget, "rendo.project.json"), "utf8")) as { surfaces: string[] };
    assert.deepEqual(projectManifest.surfaces, ["web", "miniapp"]);
    assert.ok(run("cmd", ["/c", "if exist apps\\miniapp (exit 0) else (exit 1)"], nodeTarget).status === 0);
    assert.ok(run("cmd", ["/c", "if exist apps\\mobile (exit 0) else (exit 1)"], nodeTarget).status !== 0);

    const nodeHashes = await collectDirectoryHashes(nodeTarget);
    const pythonHashes = await collectDirectoryHashes(pythonTarget);
    assert.deepEqual([...nodeHashes.entries()].sort(), [...pythonHashes.entries()].sort());

    await runLocallyWebOnlyTemplate(nodeTarget, 3200, /Multi-surface hello world, one canonical application base/);
  });
});

test("node and python CLIs create identical ai-web starter source trees", async () => {
  await ensureGeneratedAssets();
  await withTempDir("rendo-ai-web", async (dir) => {
    const createdAt = "2026-04-04T00:00:00.000Z";
    const nodeTarget = path.join(dir, "node", "ai-web-app");
    const pythonTarget = path.join(dir, "python", "ai-web-app");

    const nodeCreate = runNodeCli(
      ["create", "ai-web-next-fastapi-starter", "--output", nodeTarget, "--json"],
      repoRoot,
      { RENDO_CREATED_AT_OVERRIDE: createdAt },
    );
    const pythonCreate = runPythonCli(
      ["create", "ai-web-next-fastapi-starter", "--output", pythonTarget, "--json"],
      repoRoot,
      { RENDO_CREATED_AT_OVERRIDE: createdAt },
    );

    assert.equal(nodeCreate.status, 0, nodeCreate.stderr);
    assert.equal(pythonCreate.status, 0, pythonCreate.stderr);

    const nodeHashes = await collectDirectoryHashes(nodeTarget);
    const pythonHashes = await collectDirectoryHashes(pythonTarget);
    assert.deepEqual([...nodeHashes.entries()].sort(), [...pythonHashes.entries()].sort());
  });
});

test("node and python generated ai-web starters both run successfully", async () => {
  await ensureGeneratedAssets();
  await withTempDir("rendo-ai-web-run", async (dir) => {
    const createdAt = "2026-04-04T00:00:00.000Z";
    const nodeTarget = path.join(dir, "node", "ai-web-app");
    const pythonTarget = path.join(dir, "python", "ai-web-app");

    const nodeCreate = runNodeCli(
      ["create", "ai-web-next-fastapi-starter", "--output", nodeTarget, "--json"],
      repoRoot,
      { RENDO_CREATED_AT_OVERRIDE: createdAt },
    );
    const pythonCreate = runPythonCli(
      ["create", "ai-web-next-fastapi-starter", "--output", pythonTarget, "--json"],
      repoRoot,
      { RENDO_CREATED_AT_OVERRIDE: createdAt },
    );

    assert.equal(nodeCreate.status, 0, nodeCreate.stderr);
    assert.equal(pythonCreate.status, 0, pythonCreate.stderr);

    await runLocallyAiWebTemplate(nodeTarget, 8000, 3000);
    await runLocallyAiWebTemplate(pythonTarget, 8100, 3100);
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
