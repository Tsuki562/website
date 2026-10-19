import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { createFirmwareService } from "../services/firmware/server.mjs";
import { readConfig } from "../services/firmware/config.mjs";

const directory = await mkdtemp(join(tmpdir(), "cshk-integration-"));
const config = { ...readConfig(), dataDir: directory, port: 0 };
assert.equal(config.profiles.length, 662, "Expected all 662 upstream Target profiles to be enabled");
assert.equal(new Set(config.profiles.map(profile => profile.target)).size, 662, "Target names must be unique");

const profiles = new Map(config.profiles.map(profile => [profile.target, profile]));
for (const [target, expected] of Object.entries({
  MATEKF722: { sdk: "arm", buildMode: "config", outputExtension: "hex" },
  ACCIF435: { sdk: "arm", buildMode: "config", outputExtension: "hex" },
  "LUXHDAIO-G4": { sdk: "arm", buildMode: "config", outputExtension: "hex" },
  SITL: { sdk: "none", buildMode: "target", outputExtension: "exe" },
  PICO2_2350A: { sdk: "pico_sdk", buildMode: "config", outputExtension: "uf2" },
  ESP32S3: { sdk: "esp_idf", buildMode: "target", outputExtension: "bin" },
  GREATMOUNTAINF435: { sdk: "arm", buildMode: "config", outputExtension: "hex" }
})) {
  const profile = profiles.get(target);
  assert.ok(profile, `Missing representative Target ${target}`);
  assert.equal(profile.release, "2026.6.2", target);
  assert.deepEqual(profile.allowedOptionSets, [["CLOUD_BUILD"]], target);
  for (const [key, value] of Object.entries(expected)) assert.equal(profile[key], value, `${target}.${key}`);
}

// Exercise the HTTP and Nuxt proxy lifecycle without invoking Docker or compiling firmware.
const simulatedArtifact = Buffer.from("cshk integration test artifact\n");
const simulatedWorker = async args => {
  if (args[0] === "cp") {
    await writeFile(join(args.at(-1), basename(args[1])), simulatedArtifact);
  }
};
const service = createFirmwareService(config, simulatedWorker);
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
  const targetList = await targets.json();
  assert.equal(targetList.length, 662);
  assert.equal(new Set(targetList.map(item => item.target)).size, 662);
  for (const target of ["MATEKF722", "ACCIF435", "LUXHDAIO-G4", "SITL", "PICO2_2350A", "ESP32S3", "GREATMOUNTAINF435"]) {
    assert.ok(targetList.some(item => item.target === target), target);
  }

  const releases = await fetch(`${base}/api/betaflight/api/targets/LUXHDAIO-G4`);
  assert.equal(releases.status, 200);
  assert.deepEqual(await releases.json(), {
    target: "LUXHDAIO-G4",
    releases: [{ release: "2026.6.2", type: "Stable", label: "Stable" }]
  });

  for (const [target, mcu] of Object.entries({
    MATEKF722: "STM32F722", "LUXHDAIO-G4": "STM32G474",
    SITL: "SITL", PICO2_2350A: "RP2350A", ESP32S3: "ESP32S3",
    GREATMOUNTAINF435: "AT32F435M"
  })) {
    const detail = await fetch(`${base}/api/betaflight/api/builds/2026.6.2/${target}`);
    assert.equal(detail.status, 200, target);
    const body = await detail.json();
    assert.equal(body.target, target);
    assert.equal(body.mcu, mcu);
    assert.equal(body.cloudBuild, true);
  }

  const options = await fetch(`${base}/api/betaflight/api/options/2026.6.2?target=${encodeURIComponent("MATEKF722")}`);
  assert.equal(options.status, 200);
  assert.deepEqual(await options.json(), { radioProtocols: [], telemetryProtocols: [], motorProtocols: [], generalOptions: [] });

  const unknownTarget = await fetch(`${base}/api/betaflight/api/builds/2026.6.2/NOT_A_REAL_TARGET`);
  assert.equal(unknownTarget.status, 404);

  const missingDefaultOption = await fetch(`${base}/api/firmware/jobs`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: "MATEKF722", release: "2026.6.2", options: [] })
  });
  assert.equal(missingDefaultOption.status, 400);

  const unknownSubmission = await fetch(`${base}/api/firmware/jobs`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: "NOT_A_REAL_TARGET", release: "2026.6.2", options: ["CLOUD_BUILD"] })
  });
  assert.equal(unknownSubmission.status, 400);

  const accepted = await fetch(`${base}/api/firmware/jobs`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: "MATEKF722", release: "2026.6.2", options: ["CLOUD_BUILD"] })
  });
  assert.equal(accepted.status, 202);
  const submitted = await accepted.json();
  assert.match(submitted.id, /^[a-f0-9]{32}$/);
  assert.match(submitted.accessToken, /^[A-Za-z0-9_-]{32}$/);
  assert.equal(submitted.file, "betaflight_2026.6.2_STM32F722_MATEKF722.hex");

  let completed;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const status = await fetch(`${base}/api/firmware/jobs/${submitted.id}?token=${encodeURIComponent(submitted.accessToken)}`);
    assert.equal(status.status, 200);
    completed = (await status.json()).job;
    if (["ready", "failed"].includes(completed.status)) break;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  assert.equal(completed.status, "ready");
  assert.equal(completed.sha256, createHash("sha256").update(simulatedArtifact).digest("hex"));

  const firmware = await fetch(`${base}/api/firmware/jobs/${submitted.id}/download?token=${encodeURIComponent(submitted.accessToken)}`);
  assert.equal(firmware.status, 200);
  assert.match(firmware.headers.get("content-disposition") || "", /attachment; filename="betaflight_2026.6.2_STM32F722_MATEKF722.hex"/);
  assert.equal(firmware.headers.get("x-firmware-sha256"), completed.sha256);
  assert.deepEqual(Buffer.from(await firmware.arrayBuffer()), simulatedArtifact);

  const crossOriginCancel = await fetch(`${base}/api/firmware/jobs/${"a".repeat(32)}/cancel?token=${"b".repeat(32)}`, {
    method: "POST", headers: { "Origin": "https://attacker.invalid" }
  });
  assert.equal(crossOriginCancel.status, 403);
  console.log("Passed: navigation/app assets, 662 enabled upstream Targets, representative SDK metadata, option validation, simulated task creation/download, and cross-origin protection.");
} finally {
  web.kill("SIGTERM");
  await once(web, "exit");
  await service.close();
  await rm(directory, { recursive: true, force: true });
}
