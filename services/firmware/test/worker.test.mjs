import test from "node:test";
import assert from "node:assert/strict";
import { access, mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { JobStore } from "../store.mjs";
import { BuildQueue } from "../worker.mjs";

test("worker requests the profile-specific HEX and records 24-hour retention", async () => {
  const directory = await mkdtemp(join(tmpdir(), "cshk-worker-test-"));
  const store = new JobStore(directory);
  const calls = [];
  const execute = async args => {
    calls.push(args);
    if (args[0] === "cp") {
      const filename = args[1].split("/").at(-1);
      await writeFile(join(args[2], filename), ":00000001FF\n");
    }
  };
  const queue = new BuildQueue(store, { dataDir: directory, concurrency: 1, buildTimeoutMs: 1000,
    memory: "128m", cpus: "0.1" }, execute);
  try {
    const { job } = store.create({ profile: { target: "TESTF7", mcu: "STM32F7", release: "1.0.0", image: "cshk-betaflight:test", fixedOptions: [] }, options: [] });
    queue.pump();
    await queue.running.get(job.id).promise;
    const completed = store.get(job.id);
    assert.equal(completed.status, "ready");
    assert.equal(store.publicJob(completed).fileName, "betaflight_1.0.0_STM32F7_TESTF7.hex");
    assert.match(completed.sha256, /^[a-f0-9]{64}$/);
    assert.equal(Date.parse(completed.expires_at) - Date.parse(completed.completed_at), 24 * 3600_000);
    assert.equal(completed.artifact, join(directory, "artifacts", job.id, "betaflight_1.0.0_STM32F7_TESTF7.hex"));
    assert.equal(queue.running.size, 0);
    const create = calls.find(args => args[0] === "create");
    assert.ok(create.includes("--network=none"));
    assert.ok(create.includes("--cap-drop=ALL"));
    assert.ok(calls.some(args => args[0] === "cp"
      && args[1] === `cshk-build-${job.id}:/source/obj/betaflight_1.0.0_STM32F7_TESTF7.hex`));
    assert.deepEqual(calls.at(-1), ["rm", "-f", `cshk-build-${job.id}`]);
  } finally {
    await queue.stop();
    store.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test("worker fails and removes artifacts if the expected HEX is missing", async () => {
  const directory = await mkdtemp(join(tmpdir(), "cshk-worker-test-"));
  const store = new JobStore(directory);
  const execute = async args => {
    if (args[0] === "cp") await writeFile(join(args[2], "other-target.hex"), ":00000001FF\n");
  };
  const queue = new BuildQueue(store, { dataDir: directory, concurrency: 1, buildTimeoutMs: 1000,
    memory: "128m", cpus: "0.1" }, execute);
  try {
    const { job } = store.create({ profile: { target: "TESTF7", mcu: "STM32F7", release: "1.0.0", image: "cshk-betaflight:test", fixedOptions: [] }, options: [] });
    queue.pump();
    await queue.running.get(job.id).promise;
    assert.equal(store.get(job.id).status, "failed");
    await assert.rejects(access(join(directory, "artifacts", job.id)));
  } finally {
    await queue.stop();
    store.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test("worker times out, removes its container and releases its slot", async () => {
  const directory = await mkdtemp(join(tmpdir(), "cshk-worker-test-"));
  const store = new JobStore(directory);
  const calls = [];
  const execute = async args => {
    calls.push(args);
    if (args[0] === "start") return new Promise(() => {});
  };
  const queue = new BuildQueue(store, { dataDir: directory, concurrency: 1, buildTimeoutMs: 10,
    memory: "128m", cpus: "0.1" }, execute);
  try {
    const { job } = store.create({ profile: { target: "TESTF7", mcu: "STM32F7", release: "1.0.0", image: "cshk-betaflight:test", fixedOptions: [] }, options: [] });
    queue.pump();
    await queue.running.get(job.id).promise;
    assert.equal(store.get(job.id).status, "failed");
    assert.deepEqual(calls.at(-1), ["rm", "-f", `cshk-build-${job.id}`]);
    assert.equal(queue.running.size, 0);
    await assert.rejects(access(join(directory, "artifacts", job.id)));
  } finally {
    await queue.stop();
    store.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test("cancelling a running build removes its container without marking it failed", async () => {
  const directory = await mkdtemp(join(tmpdir(), "cshk-worker-test-"));
  const store = new JobStore(directory);
  let rejectStart;
  const calls = [];
  const execute = async args => {
    calls.push(args);
    if (args[0] === "start") return new Promise((resolve, reject) => { rejectStart = reject; });
    if (args[0] === "rm") rejectStart?.(new Error("Container removed"));
  };
  const queue = new BuildQueue(store, { dataDir: directory, concurrency: 1, buildTimeoutMs: 1000,
    memory: "128m", cpus: "0.1" }, execute);
  try {
    const { job } = store.create({ profile: { target: "TESTF7", mcu: "STM32F7", release: "1.0.0", image: "cshk-betaflight:test", fixedOptions: [] }, options: [] });
    queue.pump();
    const handle = queue.running.get(job.id);
    await new Promise(resolve => setImmediate(resolve));
    await queue.cancel(store.get(job.id));
    await handle.promise;
    assert.equal(store.get(job.id).status, "cancelled");
    assert.equal(queue.running.size, 0);
    assert.ok(calls.some(args => args[0] === "rm" && args[2] === `cshk-build-${job.id}`));
    await assert.rejects(access(join(directory, "artifacts", job.id)));
  } finally {
    await queue.stop();
    store.close();
    await rm(directory, { recursive: true, force: true });
  }
});
