import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createFirmwareService } from "../services/firmware/server.mjs";
import { readConfig } from "../services/firmware/config.mjs";

const directory = await mkdtemp(join(tmpdir(), "cshk-integration-"));
const config = { ...readConfig(), dataDir: directory, port: 0 };
const service = createFirmwareService(config);
await service.ready;
await new Promise(resolve => service.server.listen(0, "127.0.0.1", resolve));
const web = spawn(process.execPath, [".output/server/index.mjs"], {
  cwd: new URL("../apps/web/", import.meta.url),
  env: { ...process.env, HOST: "127.0.0.1", PORT: "3197",
    NUXT_FIRMWARE_API_BASE_URL: `http://127.0.0.1:${service.server.address().port}` },
  stdio: ["ignore", "pipe", "pipe"]
});
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Nuxt startup timed out")), 15_000);
    web.on("error", reject);
    web.stdout.on("data", data => { if (String(data).includes("Listening")) { clearTimeout(timer); resolve(); } });
  });
  const base = "http://127.0.0.1:3197";
  for (const path of ["/", "/en/", "/downloads/"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /href="\/betaflight\/"/);
  }
  const app = await fetch(`${base}/betaflight/`);
  assert.equal(app.status, 200);
  const html = await app.text();
  assert.match(html, /<title>Betaflight<\/title>/);
  for (const match of html.matchAll(/(?:src|href)="(\/betaflight\/[^\"]+)"/g)) {
    const asset = await fetch(base + match[1]);
    assert.equal(asset.status, 200, match[1]);
    if (match[1].endsWith(".js")) assert.match(asset.headers.get("content-type"), /javascript/);
    if (match[1].endsWith(".css")) assert.match(asset.headers.get("content-type"), /css/);
  }
  const appWithoutSlash = await fetch(`${base}/betaflight?job=example`);
  assert.equal(appWithoutSlash.status, 200);
  const manifest = await (await fetch(`${base}/betaflight/manifest.webmanifest`)).json();
  assert.equal(manifest.scope, "/betaflight/");
  const targets = await fetch(`${base}/api/betaflight/api/targets`);
  assert.equal(targets.status, 200);
  assert.deepEqual(await targets.json(), []);
  const denied = await fetch(`${base}/api/firmware/jobs`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: "GREATMOUNTAINF435", release: "2026.6.2", options: [] })
  });
  assert.equal(denied.status, 400);
  const crossOriginCancel = await fetch(`${base}/api/firmware/jobs/${"a".repeat(32)}/cancel?token=${"b".repeat(32)}`, {
    method: "POST", headers: { "Origin": "https://attacker.invalid" }
  });
  assert.equal(crossOriginCancel.status, 403);
  console.log("Passed: Chinese/English navigation, hosted app/assets, local API proxy, unverified Target rejection.");
} finally {
  web.kill("SIGTERM");
  await once(web, "exit");
  await service.close();
  await rm(directory, { recursive: true, force: true });
}
