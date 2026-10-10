import { DatabaseSync } from "node:sqlite";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const hash = value => createHash("sha256").update(value).digest("hex");

export class JobStore {
  constructor(directory) {
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(join(directory, "jobs.sqlite"));
    this.db.exec(`PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY, token_hash TEXT NOT NULL, status TEXT NOT NULL,
      request TEXT NOT NULL, created_at TEXT NOT NULL, completed_at TEXT,
      expires_at TEXT, artifact TEXT, sha256 TEXT, message TEXT NOT NULL
    );`);
  }

  create(request) {
    const id = randomBytes(16).toString("hex");
    const token = randomBytes(24).toString("base64url");
    this.db.prepare("INSERT INTO jobs (id,token_hash,status,request,created_at,message) VALUES (?,?,?,?,?,?)")
      .run(id, hash(token), "queued", JSON.stringify(request), new Date().toISOString(), "Waiting for a build slot.");
    return { job: this.get(id), token };
  }

  get(id) { return this.db.prepare("SELECT * FROM jobs WHERE id=?").get(id); }
  list(status) { return this.db.prepare("SELECT * FROM jobs WHERE status=? ORDER BY created_at,rowid").all(status); }

  authorize(id, token) {
    const job = this.get(id);
    const expected = Buffer.from(job?.token_hash || "0".repeat(64), "hex");
    const actual = Buffer.from(hash(typeof token === "string" ? token : ""), "hex");
    if (!timingSafeEqual(expected, actual) || !job) return null;
    return job;
  }

  update(id, fields) {
    const allowed = ["status", "completed_at", "expires_at", "artifact", "sha256", "message"];
    if (Object.keys(fields).some(key => !allowed.includes(key))) throw new Error("Invalid job update");
    const keys = Object.keys(fields);
    this.db.prepare(`UPDATE jobs SET ${keys.map(key => `${key}=?`).join(",")} WHERE id=?`)
      .run(...keys.map(key => fields[key]), id);
  }

  publicJob(job) {
    const request = JSON.parse(job.request);
    return {
      id: job.id, status: job.status, target: request.profile.target, release: request.profile.release,
      createdAt: job.created_at, completedAt: job.completed_at, expiresAt: job.expires_at,
      message: job.message, sha256: job.sha256,
      fileName: job.status === "ready" ? `betaflight_${request.profile.release}_${request.profile.target}.hex` : null
    };
  }

  close() { this.db.close(); }
}
