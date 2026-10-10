import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, access, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { JobStore } from "../store.mjs";
import { BuildQueue } from "../worker.mjs";

test("queued tasks survive reopening, tokens stay private, and waiting does not expire", async () => {
  const directory = await mkdtemp(join(tmpdir(), "cshk-store-test-"));
  let store = new JobStore(directory);
  try {
    const { job, token } = store.create({ profile: { target: "TESTF7", release: "1.0.0" }, options: [] });
    store.close();
    store = new JobStore(directory);
    const saved = store.authorize(job.id, token);
    assert.equal(saved.status, "queued");
    assert.equal(saved.token_hash.includes(token), false);
    const queue = new BuildQueue(store, { dataDir: directory, concurrency: 1 });
    await queue.cleanup();
    assert.equal(store.get(job.id).status, "queued");
    assert.equal("token_hash" in store.publicJob(saved), false);
    assert.equal("request" in store.publicJob(saved), false);
  } finally { store.close(); await rm(directory, { recursive: true, force: true }); }
});

test("cleanup removes expired firmware while keeping unexpired artifacts", async () => {
  const directory = await mkdtemp(join(tmpdir(), "cshk-cleanup-test-"));
  const store = new JobStore(directory);
  try {
    const jobs = [store.create({ profile: { target: "TESTF7", release: "1.0.0" } }).job,
      store.create({ profile: { target: "TESTF7", release: "1.0.0" } }).job];
    for (const [index, job] of jobs.entries()) {
      const output = join(directory, "artifacts", job.id);
      await mkdir(output, { recursive: true });
      await writeFile(join(output, "firmware.hex"), ":00000001FF\n");
      store.update(job.id, { status: "ready", artifact: join(output, "firmware.hex"),
        expires_at: new Date(Date.now() + (index === 0 ? -1000 : 3600_000)).toISOString() });
    }
    const queue = new BuildQueue(store, { dataDir: directory, concurrency: 1 });
    await queue.cleanup();
    assert.equal(store.get(jobs[0].id).status, "expired");
    assert.equal(store.get(jobs[0].id).artifact, null);
    await assert.rejects(access(join(directory, "artifacts", jobs[0].id)));
    assert.equal(store.get(jobs[1].id).status, "ready");
    await access(store.get(jobs[1].id).artifact);
  } finally { store.close(); await rm(directory, { recursive: true, force: true }); }
});
