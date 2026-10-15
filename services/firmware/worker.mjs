import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { firmwareFileName } from "./config.mjs";

export function runDocker(args) {
  return new Promise((resolve, reject) => {
    const process = spawn("docker", args, { stdio: ["ignore", "ignore", "pipe"] });
    let errorText = "";
    process.stderr.on("data", data => { if (errorText.length < 8192) errorText += data; });
    process.on("error", reject);
    process.on("exit", code => code === 0 ? resolve() : reject(new Error(`Docker exited ${code}: ${errorText}`)));
  });
}

export class BuildQueue {
  constructor(store, config, execute = runDocker) {
    this.store = store;
    this.config = config;
    this.execute = execute;
    this.running = new Map();
    this.stopping = false;
  }

  async recover() {
    for (const job of this.store.list("building")) {
      await this.execute(["rm", "-f", `cshk-build-${job.id}`]).catch(() => {});
      this.store.update(job.id, { status: "failed", message: "Build interrupted by a service restart. Submit again." });
      await this.removeArtifacts(job.id);
    }
    await this.cleanup();
    this.pump();
    this.timer = setInterval(() => this.cleanup().catch(console.error), 60_000);
    this.timer.unref();
  }

  pump() {
    if (this.stopping) return;
    while (this.running.size < this.config.concurrency) {
      const job = this.store.list("queued")[0];
      if (!job) break;
      this.store.update(job.id, { status: "building", message: "Compiling firmware." });
      const handle = { cancelled: false, promise: null };
      this.running.set(job.id, handle);
      handle.promise = this.build(job, handle).finally(() => { this.running.delete(job.id); this.pump(); });
    }
  }

  async build(job, handle) {
    const { profile, options } = JSON.parse(job.request);
    const output = join(this.config.dataDir, "artifacts", job.id);
    const name = `cshk-build-${job.id}`;
    let timeout;
    try {
      await mkdir(output, { recursive: true });
      if (handle.cancelled) return;
      const flags = [...profile.fixedOptions, ...options].join(" ");
      const selector = profile.buildMode === "config" ? `CONFIG=${profile.target}` : `TARGET=${profile.target}`;
      await this.execute(["create", "--name", name, "--network=none", "--cap-drop=ALL",
        "--security-opt=no-new-privileges", `--memory=${this.config.memory}`, `--cpus=${this.config.cpus}`,
        "--pids-limit=256", "--label=cshk.firmware=true", profile.image,
        "make", selector, `OPTIONS=${flags}`, "-j1"]);
      if (handle.cancelled) return;
      await Promise.race([
        this.execute(["start", "-a", name]),
        new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error("Build timeout")), this.config.buildTimeoutMs); })
      ]);
      if (handle.cancelled) return;
      // Betaflight names the HEX from version, MCU, and target; avoid stale or unrelated obj files.
      const artifactName = firmwareFileName(profile);
      const artifact = join(output, artifactName);
      await this.execute(["cp", `${name}:/source/obj/${artifactName}`, output]);
      const size = (await stat(artifact)).size;
      if (!size || size > 10 * 1024 * 1024) throw new Error("Invalid firmware artifact");
      const bytes = await readFile(artifact);
      if (handle.cancelled) return;
      const completed = new Date();
      this.store.update(job.id, {
        status: "ready", artifact, sha256: createHash("sha256").update(bytes).digest("hex"),
        completed_at: completed.toISOString(), expires_at: new Date(+completed + 24 * 3600_000).toISOString(),
        message: "Firmware ready. Download within 24 hours; verify your board before flashing."
      });
    } catch (error) {
      console.error(`Build ${job.id} failed:`, error.message);
      if (!handle.cancelled) this.store.update(job.id, { status: "failed", message: "Compilation failed. Contact support with the task number." });
    } finally {
      clearTimeout(timeout);
      await this.execute(["rm", "-f", name]).catch(() => {});
      if (this.store.get(job.id)?.status !== "ready") await this.removeArtifacts(job.id);
    }
  }

  async cancel(job) {
    if (!["queued", "building"].includes(job.status)) return;
    const handle = this.running.get(job.id);
    if (handle) handle.cancelled = true;
    this.store.update(job.id, { status: "cancelled", message: "Cancelled by the task owner." });
    if (handle) await this.execute(["rm", "-f", `cshk-build-${job.id}`]).catch(() => {});
    this.pump();
  }

  async removeArtifacts(id) {
    if (!/^[a-f0-9]{32}$/.test(id)) throw new Error("Invalid artifact directory");
    await rm(join(this.config.dataDir, "artifacts", id), { recursive: true, force: true });
  }

  async cleanup() {
    for (const job of [...this.store.list("ready"), ...this.store.list("expired")]) {
      if (job.expires_at && Date.parse(job.expires_at) <= Date.now()) {
        this.store.update(job.id, { status: "expired", artifact: null, message: "The 24-hour download period has ended." });
        await this.removeArtifacts(job.id);
      }
    }
  }

  async stop() {
    this.stopping = true;
    clearInterval(this.timer);
    for (const id of this.running.keys()) await this.cancel(this.store.get(id));
    await Promise.all([...this.running.values()].map(handle => handle.promise));
  }
}
