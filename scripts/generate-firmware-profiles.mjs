import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const release = "2026.6.2";
const commit = "e0b7bb01b17b21351057e9ead2d1ab39dd44fa16";
const sourceRoot = resolve(process.argv[2] || process.env.BETAFLIGHT_SOURCE_DIR || "");
if (!process.argv[2] && !process.env.BETAFLIGHT_SOURCE_DIR) {
  throw new Error("Pass the local Betaflight source checkout path; no download will be started.");
}

function git(directory, args, maxBuffer = 16 * 1024 * 1024) {
  return execFileSync("git", ["-C", directory, ...args], { encoding: "utf8", maxBuffer }).trimEnd();
}

function blob(directory, revision, path) {
  return git(directory, ["show", `${revision}:${path}`]);
}

git(sourceRoot, ["cat-file", "-e", `${commit}^{commit}`]);
const submoduleEntry = git(sourceRoot, ["ls-tree", commit, "src/config"]);
const configCommit = submoduleEntry.match(/^160000 commit ([a-f0-9]{40})\tsrc\/config$/m)?.[1];
if (!configCommit) throw new Error(`Could not resolve pinned src/config commit from Betaflight ${release}.`);

const configRoot = resolve(sourceRoot, "src/config");
git(configRoot, ["cat-file", "-e", `${configCommit}^{commit}`]);
const sourceFiles = git(sourceRoot, ["ls-tree", "-r", "--name-only", commit]).split("\n");
const platformFiles = sourceFiles.filter(path => /^src\/platform\/[^/]+\/target\/[^/]+\/target\.mk$/.test(path));
const platformMetadata = new Map();

for (const path of platformFiles) {
  const [, platform, target] = path.match(/^src\/platform\/([^/]+)\/target\/([^/]+)\/target\.mk$/);
  const targetText = blob(sourceRoot, commit, path);
  const family = targetText.match(/^TARGET_MCU_FAMILY\s*:?=\s*([A-Z0-9_]+)/m)?.[1];
  if (!family) throw new Error(`No TARGET_MCU_FAMILY found in ${path}.`);
  const makePath = `src/platform/${platform}/mk/${family}.mk`;
  const makeText = blob(sourceRoot, commit, makePath);
  const sdk = makeText.match(/^PLATFORM_SDK\s*:?=\s*([A-Za-z0-9_-]+)/m)?.[1];
  if (!sdk) throw new Error(`No PLATFORM_SDK found in ${makePath}.`);
  const outputExtension = makeText.match(/^DEFAULT_OUTPUT\s*:?=\s*([a-z0-9]+)/m)?.[1] || "hex";
  const metadata = { platform, family, sdk, outputExtension };
  if (platformMetadata.has(target)) throw new Error(`Duplicate upstream platform target ${target}.`);
  platformMetadata.set(target, metadata);
}

const configPaths = git(configRoot, ["ls-tree", "-r", "--name-only", configCommit]).split("\n")
  .filter(path => /^configs\/.+\/config\.h$/.test(path));
const mcuLines = git(configRoot, ["grep", "-I", "-E", "^[[:space:]]*#define[[:space:]]+FC_TARGET_MCU", configCommit, "--", "configs/"], 32 * 1024 * 1024)
  .split("\n").filter(Boolean);
const configByPath = new Map();

for (const entry of mcuLines) {
  const firstColon = entry.indexOf(":");
  const secondColon = entry.indexOf(":", firstColon + 1);
  const path = entry.slice(firstColon + 1, secondColon);
  const line = entry.slice(secondColon + 1);
  const target = path.split("/").at(-2);
  const mcu = line.match(/\bFC_TARGET_MCU\s+([A-Z0-9_]+)/)?.[1];
  if (!target || !mcu) throw new Error(`Could not parse FC_TARGET_MCU from ${path}.`);
  if (configByPath.has(path)) throw new Error(`Multiple FC_TARGET_MCU declarations in ${path}.`);
  configByPath.set(path, { target, mcu });
}

if (configByPath.size !== configPaths.length) {
  throw new Error(`Expected one MCU declaration for each config: found ${configByPath.size} declarations for ${configPaths.length} config.h files.`);
}

const profiles = [];
function addProfile({ target, manufacturer, mcu, sdk, buildMode, outputExtension }) {
  if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(target) || !/^[A-Z0-9]+$/.test(mcu)) {
    throw new Error(`Invalid upstream target or MCU name: ${target} / ${mcu}.`);
  }
  const baseSdk = sdk === "none" ? "arm" : sdk;
  const imageSuffix = sdk === "arm" ? "" : `-${sdk}`;
  profiles.push({
    enabled: true,
    target,
    manufacturer,
    hardwareVersion: "official-upstream",
    mcu,
    release,
    releaseType: "Stable",
    commit,
    image: `cshk-betaflight:${release}${imageSuffix}`,
    toolchain: `betaflight/betaflight-build:${baseSdk}-2026.6 (digest pending verification)`,
    sdk,
    buildMode,
    outputExtension,
    allowedOptions: ["CLOUD_BUILD"],
    allowedOptionSets: [["CLOUD_BUILD"]],
    fixedOptions: [],
    optionGroups: { radioProtocols: [], telemetryProtocols: [], motorProtocols: [], generalOptions: [] }
  });
}

const configTargets = new Set();
for (const path of configPaths) {
  const entry = configByPath.get(path);
  if (!entry) throw new Error(`Missing MCU metadata for ${path}.`);
  const metadata = platformMetadata.get(entry.mcu);
  if (!metadata) throw new Error(`No upstream toolchain mapping for config ${entry.target} MCU ${entry.mcu}.`);
  const parts = path.slice("configs/".length).split("/");
  const manufacturer = parts.length > 2 ? parts[0] : "Betaflight";
  if (configTargets.has(entry.target)) throw new Error(`Duplicate upstream config target ${entry.target}.`);
  configTargets.add(entry.target);
  addProfile({ ...entry, manufacturer, ...metadata, buildMode: "config" });
}

const baseTargets = new Set();
for (const path of platformFiles) {
  const [, platform, target] = path.match(/^src\/platform\/([^/]+)\/target\/([^/]+)\/target\.mk$/);
  const metadata = platformMetadata.get(target);
  if (!metadata) throw new Error(`Missing platform metadata for ${target}.`);
  if (configTargets.has(target) || baseTargets.has(target)) throw new Error(`Duplicate upstream target ${target}.`);
  baseTargets.add(target);
  addProfile({ target, manufacturer: "Betaflight", mcu: target, ...metadata, buildMode: "target" });
}

profiles.sort((left, right) => left.target.localeCompare(right.target));
const output = fileURLToPath(new URL("../services/firmware/profiles.json", import.meta.url));
writeFileSync(output, `${JSON.stringify({ profiles }, null, 2)}\n`);
console.log(`Generated ${profiles.length} enabled profiles (${configTargets.size} configs, ${baseTargets.size} platform targets), from Betaflight ${release}.`);
