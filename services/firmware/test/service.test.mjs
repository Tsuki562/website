import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createFirmwareService } from "../server.mjs";

test("creates, protects, reads, and cancels anonymous jobs", async () => {
  const dataDir = await mkdtemp(join(tmpdir(), "cshk-firmware-test-"));
  const profile = { enabled: true, target: "TESTF7", manufacturer: "TEST", hardwareVersion: "1",
    mcu: "STM32F7", release: "1.0.0", releaseType: "Stable", commit: "a".repeat(40), image: "cshk-betaflight:test",
    toolchain: "test", allowedOptions: ["CLOUD_BUILD"], allowedOptionSets: [["CLOUD_BUILD"]], fixedOptions: [], optionGroups: {} };
  let releaseBuild;
  const execute = async args => {
    if (args[0] === "start") await new Promise(resolve => { releaseBuild = resolve; });
  };
  const service = createFirmwareService({ profiles: [profile], dataDir, host: "127.0.0.1", port: 0,
    concurrency: 1, queueLimit: 5, buildTimeoutMs: 5000, memory: "128m", cpus: "0.1" }, execute);
  service.server.keepAliveTimeout = 1;
  await service.ready;
  await new Promise(resolve => service.server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${service.server.address().port}`;
  try {
    const createdResponse = await fetch(`${base}/api/builds`, { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ target: profile.target, release: profile.release, options: ["CLOUD_BUILD"] }) });
    assert.equal(createdResponse.status, 202);
    const created = await createdResponse.json();
    const unauthorized = await fetch(`${base}/jobs/${created.id}?token=wrong`);
    assert.equal(unauthorized.status, 404);
    await unauthorized.arrayBuffer();
    const response = await fetch(`${base}/jobs/${created.id}?token=${created.accessToken}`);
    assert.equal(response.status, 200);
    assert.match((await response.json()).job.status, /queued|building/);
    const cancelled = await fetch(`${base}/jobs/${created.id}/cancel?token=${created.accessToken}`, { method: "POST" });
    assert.equal(cancelled.status, 200);
    assert.equal((await cancelled.json()).job.status, "cancelled");
    releaseBuild?.();
  } finally {
    releaseBuild?.();
    const closing = service.close();
    service.server.closeAllConnections?.();
    await closing;
    await rm(dataDir, { recursive: true, force: true });
  }
});
