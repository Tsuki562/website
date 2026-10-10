import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { JobStore } from "../store.mjs";
import { BuildQueue } from "../worker.mjs";

test("worker collects one HEX, records checksum and 24-hour retention, then releases the slot", async () => {
  const directory = await mkdtemp(join(tmpdir(), "cshk-worker-test-"));
  const store = new JobStore(directory);
  const calls = [];
  const execute = async args => {
    calls.push(args);
    if (args[0] === "cp") await writeFile(join(args[2], "test.hex"), ":00000001FF\n");
  };
  const queue = new BuildQueue(store, { dataDir: directory, concurrency: 1, buildTimeoutMs: 1000,
    memory: "128m", cpus: "0.1" }, execute);
  try {
    const { job } = store.create({ profile: { target: "TESTF7", release: "1.0.0", image: "cshk-betaflight:test", fixedOptions: [] }, options: [] });
    queue.pump();
    await queue.running.get(job.id).promise;
    const completed = store.get(job.id);
    assert.equal(completed.status, "ready");
    assert.match(completed.sha256, /^[a-f0-9]{64}$/);
    assert.equal(Date.parse(completed.expires_at) - Date.parse(completed.completed_at), 24 * 3600_000);
    assert.equal(queue.running.size, 0);
    const create = calls.find(args => args[0] === "create");
    assert.ok(create.includes("--network=none"));
    assert.ok(create.includes("--cap-drop=ALL"));
    assert.deepEqual(calls.at(-1), ["rm", "-f", `cshk-build-${job.id}`]);
  } finally {
    await queue.stop();
    store.close();
    await rm(directory, { recursive: true, force: true });
  }
});
