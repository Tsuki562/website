import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { pathToFileURL } from "node:url";
import { readConfig, validateRequest } from "./config.mjs";
import { JobStore } from "./store.mjs";
import { BuildQueue } from "./worker.mjs";

const failure = (status, message) => Object.assign(new Error(message), { status });
const json = (response, status, body) => {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" });
  response.end(JSON.stringify(body));
};

async function readJson(request) {
  if (!request.headers["content-type"]?.startsWith("application/json")) throw failure(415, "JSON required");
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw failure(413, "Request too large");
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString()); }
  catch { throw failure(400, "Invalid JSON"); }
}

export function createFirmwareService(config, execute) {
  const store = new JobStore(config.dataDir);
  const queue = new BuildQueue(store, config, execute);
  const ready = queue.recover();
  const server = createServer(async (request, response) => {
    try {
      await ready;
      const url = new URL(request.url, "http://localhost");
      const path = url.pathname;
      const method = request.method;
      if (path === "/health" && method === "GET") {
        return json(response, 200, { service: "cshk-firmware", enabledProfiles: config.profiles.length, running: queue.running.size });
      }
      if (path === "/api/targets" && method === "GET") {
        const targets = [...new Map(config.profiles.map(profile => [profile.target, {
          target: profile.target, manufacturer: profile.manufacturer, group: "unsupported"
        }])).values()];
        return json(response, 200, targets);
      }
      const targetMatch = path.match(/^\/api\/targets\/([A-Z0-9_]+)$/);
      if (targetMatch && method === "GET") {
        const profiles = config.profiles.filter(profile => profile.target === targetMatch[1]);
        const releases = profiles.map(profile => ({ release: profile.release, type: profile.releaseType,
          label: profile.releaseType === "Stable" ? "Stable" : "测试版 / May be unstable" }));
        return json(response, 200, { target: targetMatch[1], releases });
      }
      const detailMatch = path.match(/^\/api\/builds\/([\w.-]+)\/([A-Z0-9_]+)$/);
      if (detailMatch && method === "GET") {
        const profile = config.profiles.find(item => item.release === detailMatch[1] && item.target === detailMatch[2]);
        if (!profile) throw failure(404, "Build profile not found");
        return json(response, 200, { target: profile.target, release: profile.release, releaseType: profile.releaseType,
          name: profile.release, mcu: profile.mcu, manufacturer: profile.manufacturer, cloudBuild: true,
          url: `https://github.com/betaflight/betaflight/releases/tag/${profile.release}`, configuration: null });
      }
      const optionsMatch = path.match(/^\/api\/options\/([\w.-]+)(?:\/[a-f0-9]{32})?$/);
      if (optionsMatch && method === "GET") {
        const profile = config.profiles.find(item => item.release === optionsMatch[1] && item.target === url.searchParams.get("target"));
        if (!profile) throw failure(404, "Build options not found");
        return json(response, 200, profile.optionGroups);
      }
      if (path.match(/^\/api\/releases\/[\w.-]+\/commits$/) && method === "GET") {
        return json(response, 200, config.profiles.filter(profile => profile.releaseType === "Unstable")
          .map(profile => ({ sha: profile.commit, message: "Administrator-approved development commit" })));
      }
      if (path === "/api/builds" && method === "POST") {
        const validated = validateRequest(await readJson(request), config.profiles);
        if (store.list("queued").length >= config.queueLimit) throw failure(429, "Queue full. Please try again later.");
        const { job, token } = store.create(validated);
        const key = `${job.id}.${token}`;
        queue.pump();
        return json(response, 202, { key, id: job.id, accessToken: token,
          file: `betaflight_${validated.profile.release}_${validated.profile.target}.hex`,
          url: `/api/builds/${key}/firmware`,
          taskUrl: `/downloads/task/${job.id}?token=${encodeURIComponent(token)}` });
      }
      const jobMatch = path.match(/^\/api\/builds\/([a-f0-9]{32})\.([A-Za-z0-9_-]{32})\/(status|firmware|json|cancel|log)$/);
      const websiteJob = path.match(/^\/jobs\/([a-f0-9]{32})(?:\/(download|cancel))?$/);
      if (jobMatch || websiteJob) {
        const id = (jobMatch || websiteJob)[1];
        const token = jobMatch ? jobMatch[2] : url.searchParams.get("token");
        let job = store.authorize(id, token);
        if (!job) throw failure(404, "Task not found");
        if (job.status === "ready" && Date.parse(job.expires_at) <= Date.now()) {
          await queue.cleanup();
          job = store.get(id);
        }
        const action = jobMatch ? jobMatch[3] : websiteJob[2];
        if (action === "cancel" && method === "POST") {
          await queue.cancel(job);
          return json(response, 200, { job: store.publicJob(store.get(id)) });
        }
        if (method !== "GET") throw failure(405, "Method not allowed");
        if (action === "firmware" || action === "download") {
          if (job.status !== "ready" || !job.artifact || !existsSync(job.artifact)) throw failure(410, "Firmware unavailable or expired");
          const info = store.publicJob(job);
          response.writeHead(200, { "Content-Type": "application/octet-stream", "Cache-Control": "no-store",
            "Content-Disposition": `attachment; filename="${info.fileName}"`, "X-Firmware-SHA256": job.sha256,
            "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff" });
          await pipeline(createReadStream(job.artifact), response);
          return;
        }
        if (action === "status") return json(response, 200, {
          status: job.status === "ready" ? "success" : ["queued", "building"].includes(job.status) ? "queued" : "failed",
          jobStatus: job.status, message: job.message
        });
        if (action === "json") return json(response, 200, { options: JSON.parse(job.request).options });
        return json(response, 200, { job: store.publicJob(job) });
      }
      if (path === "/api/app/devices" && method === "GET") return json(response, 200, []);
      if (path.startsWith("/api/app/sponsors/") && method === "GET") {
        response.writeHead(200, { "Content-Type": "text/plain" }); response.end(""); return;
      }
      throw failure(404, "Not found");
    } catch (error) {
      if (response.headersSent) { response.destroy(); return; }
      if (!error.status) console.error(error);
      json(response, error.status || 500, { message: error.status ? error.message : "Service unavailable" });
    }
  });
  return { server, store, queue, ready, async close() {
    await new Promise(resolve => server.close(resolve));
    await queue.stop();
    store.close();
  } };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const config = readConfig();
  const service = createFirmwareService(config);
  await service.ready;
  service.server.listen(config.port, config.host, () => console.log(`Firmware service: http://${config.host}:${config.port}; enabled profiles: ${config.profiles.length}`));
  for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, async () => { await service.close(); process.exit(0); });
}
