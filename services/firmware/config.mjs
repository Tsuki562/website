import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function readConfig(env = process.env) {
  const positive = (name, fallback) => {
    const value = Number(env[name] ?? fallback);
    if (!Number.isSafeInteger(value) || value < 1) throw new Error(`Invalid ${name}`);
    return value;
  };
  const file = resolve(env.FIRMWARE_PROFILES || new URL("./profiles.json", import.meta.url).pathname);
  const { profiles } = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(profiles)) throw new Error("Profiles must be an array");
  const seen = new Set();
  for (const profile of profiles) {
    if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(profile.target) || !/^[A-Z0-9]+$/.test(profile.mcu) || !/^[a-f0-9]{40}$/.test(profile.commit)
      || !/^[\w.-]+$/.test(profile.release) || !["Stable", "ReleaseCandidate", "Unstable"].includes(profile.releaseType)
      || !/^cshk-betaflight:[\w.-]+$/.test(profile.image) || !profile.hardwareVersion || !profile.toolchain
      || !["config", "target"].includes(profile.buildMode) || !["hex", "bin", "uf2", "exe"].includes(profile.outputExtension)
      || !["arm", "apm32f4", "esp_idf", "none", "pico_sdk", "stm32c5", "stm32h5", "stm32n6", "x32m7"].includes(profile.sdk)
      || !Array.isArray(profile.allowedOptions) || !Array.isArray(profile.fixedOptions)
      || !Array.isArray(profile.allowedOptionSets)
      || profile.allowedOptionSets.some(set => !Array.isArray(set) || set.some(option => !profile.allowedOptions.includes(option)))
      || [...profile.allowedOptions, ...profile.fixedOptions].some(value => !/^[A-Z][A-Z0-9_]*(=[0-9]+)?$/.test(value))) {
      throw new Error("Invalid build profile");
    }
    const key = `${profile.target}:${profile.release}`;
    if (seen.has(key)) throw new Error("Duplicate build profile");
    seen.add(key);
  }
  return {
    profiles: profiles.filter(profile => profile.enabled === true),
    dataDir: resolve(env.FIRMWARE_DATA_DIR || new URL("./data", import.meta.url).pathname),
    host: env.FIRMWARE_HOST || "127.0.0.1",
    port: positive("FIRMWARE_PORT", 8090),
    concurrency: positive("FIRMWARE_CONCURRENCY", 1),
    queueLimit: positive("FIRMWARE_QUEUE_LIMIT", 50),
    buildTimeoutMs: positive("FIRMWARE_BUILD_TIMEOUT_SECONDS", 900) * 1000,
    memory: env.FIRMWARE_WORKER_MEMORY || "2g",
    cpus: env.FIRMWARE_WORKER_CPUS || "1"
  };
}

export function firmwareFileName(profile) {
  const targetName = profile.buildMode === "config" ? `${profile.mcu}_${profile.target}` : profile.target;
  const extension = profile.outputExtension === "exe" ? "" : `.${profile.outputExtension}`;
  return `betaflight_${profile.release}_${targetName}${extension}`;
}

export function validateRequest(body, profiles) {
  if (!body || typeof body !== "object" || Array.isArray(body)
    || Object.keys(body).some(key => !["target", "release", "options", "commit"].includes(key))) {
    throw Object.assign(new Error("Invalid build request"), { status: 400 });
  }
  const profile = profiles.find(item => item.target === body.target && item.release === body.release);
  if (!profile || (body.commit && body.commit !== profile.commit)) {
    throw Object.assign(new Error("This Target or version is not enabled"), { status: 400 });
  }
  if (!Array.isArray(body.options) || body.options.length > 64 || body.options.some(option =>
    typeof option !== "string" || !profile.allowedOptions.includes(option))) {
    throw Object.assign(new Error("Unsupported build options"), { status: 400 });
  }
  const options = [...new Set(body.options)].sort();
  if (!profile.allowedOptionSets.some(set => Array.isArray(set) && JSON.stringify([...new Set(set)].sort()) === JSON.stringify(options))) {
    throw Object.assign(new Error("This option combination has not been verified"), { status: 400 });
  }
  return { profile, options };
}
