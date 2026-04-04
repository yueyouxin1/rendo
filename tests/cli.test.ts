import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const repoRoot = process.cwd();
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function run(command: string, args: string[], cwd = repoRoot) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    env: {
      ...process.env,
    },
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

async function withTempDir(name: string, fn: (dir: string) => Promise<void>) {
  const dir = await mkdtemp(path.join(os.tmpdir(), `${name}-`));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("search and inspect expose core and hello-world starters", async () => {
  const search = run("node", ["--import", "tsx", "src/bin.ts", "search", "--type", "starter", "--json"]);
  assert.equal(search.status, 0, search.stderr);

  const searchPayload = JSON.parse(search.stdout) as Array<{ id: string }>;
  assert.ok(searchPayload.some((item) => item.id === "core-starter"));
  assert.ok(searchPayload.some((item) => item.id === "hello-world-starter"));

  const inspect = run("node", ["--import", "tsx", "src/bin.ts", "inspect", "hello-world-starter", "--json"]);
  assert.equal(inspect.status, 0, inspect.stderr);

  const inspectPayload = JSON.parse(inspect.stdout) as { type: string; category: string };
  assert.equal(inspectPayload.type, "domain-starter");
  assert.equal(inspectPayload.category, "headless-agent");
});

test("domain starter authoring pipeline generates hello-world from profile", async () => {
  const generated = run(
    "node",
    ["--import", "tsx", "scripts/generate-domain-starter.ts", "headless-agent/hello-world"],
    repoRoot,
  );
  assert.equal(generated.status, 0, generated.stderr);

  const generatedPayload = JSON.parse(generated.stdout) as { profileId: string; starterId: string };
  assert.equal(generatedPayload.profileId, "headless-agent/hello-world");
  assert.equal(generatedPayload.starterId, "hello-world-starter");

  const templateManifest = JSON.parse(
    await readFile(path.join(repoRoot, "templates", "hello-world-starter", "rendo.template.json"), "utf8"),
  ) as { id: string; type: string; category: string };
  assert.equal(templateManifest.id, "hello-world-starter");
  assert.equal(templateManifest.type, "domain-starter");
  assert.equal(templateManifest.category, "headless-agent");
});

test("rendo init creates a runnable core starter", async () => {
  await withTempDir("rendo-core", async (dir) => {
    const target = path.join(dir, "core-authoring");
    await mkdir(target);
    const init = run("node", ["--import", "tsx", path.join(repoRoot, "src/bin.ts"), "init", target, "--json"], repoRoot);
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

test("rendo create rejects core starter and creates runnable hello-world starter", async () => {
  const rejected = run("node", ["--import", "tsx", "src/bin.ts", "create", "core-starter", "ignored-dir"], repoRoot);
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /Use rendo init/);

  await withTempDir("rendo-domain", async (dir) => {
    const target = path.join(dir, "hello-app");
    const create = run(
      "node",
      ["--import", "tsx", path.join(repoRoot, "src/bin.ts"), "create", "hello-world-starter", target, "--json"],
      repoRoot,
    );
    assert.equal(create.status, 0, create.stderr);

    const templateManifest = JSON.parse(await readFile(path.join(target, "rendo.template.json"), "utf8")) as { id: string; type: string };
    assert.equal(templateManifest.id, "hello-world-starter");
    assert.equal(templateManifest.type, "domain-starter");

    const install = run(npmCommand, ["install"], target);
    assert.equal(install.status, 0, install.stderr);

    const health = run(npmCommand, ["run", "health"], target);
    assert.equal(health.status, 0, health.stderr);
    assert.match(health.stdout, /"starterId": "hello-world-starter"/);
    assert.match(health.stdout, /"greeting": "Hello from the first minimal Rendo Domain Starter."/);
  });
});
