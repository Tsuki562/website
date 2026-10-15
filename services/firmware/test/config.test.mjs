import test from "node:test";
import assert from "node:assert/strict";
import { firmwareFileName, readConfig, validateRequest } from "../config.mjs";

const profile = {
  target: "MATEKF722", release: "2026.6.2", commit: "e0b7bb01b17b21351057e9ead2d1ab39dd44fa16",
  mcu: "STM32F722", buildMode: "config", outputExtension: "hex", sdk: "arm",
  allowedOptions: ["CLOUD_BUILD", "RX_CRSF"], allowedOptionSets: [["CLOUD_BUILD", "RX_CRSF"]]
};

test("accepts only an administrator-approved profile and options", () => {
  assert.deepEqual(validateRequest({ target: profile.target, release: profile.release,
    options: ["RX_CRSF", "CLOUD_BUILD", "RX_CRSF"] }, [profile]), { profile, options: ["CLOUD_BUILD", "RX_CRSF"] });
});

test("rejects arbitrary targets, options, commits, and fields", () => {
  for (const body of [
    { target: "EVIL", release: profile.release, options: [] },
    { target: profile.target, release: profile.release, options: ["-include /etc/passwd"] },
    { target: profile.target, release: profile.release, options: [], commit: "0".repeat(40) },
    { target: profile.target, release: profile.release, options: [], script: "id" },
    { target: profile.target, release: profile.release, options: ["RX_CRSF"] }
  ]) assert.throws(() => validateRequest(body, [profile]));
});

test("uses the MCU family in the Betaflight firmware artifact filename", () => {
  assert.equal(firmwareFileName(profile),
    "betaflight_2026.6.2_STM32F722_MATEKF722.hex");
});

test("enables every pinned upstream Target, including the GMRC config present upstream", () => {
  const config = readConfig();
  assert.equal(config.profiles.length, 662);
  assert.ok(config.profiles.every(item => item.enabled === undefined || item.enabled === true));
  assert.equal(new Set(config.profiles.map(item => item.target)).size, 662);
  assert.ok(config.profiles.some(item => item.target === "MATEKF722"));
  assert.ok(config.profiles.some(item => item.target === "GREATMOUNTAINF435" && item.manufacturer === "GMRC"));
  assert.ok(config.profiles.some(item => item.target.includes("-")));
  const hyphenTarget = config.profiles.find(item => item.target.includes("-"));
  assert.equal(validateRequest({ target: hyphenTarget.target, release: hyphenTarget.release, options: ["CLOUD_BUILD"] }, config.profiles).profile,
    hyphenTarget);
});

test("uses each upstream Target build mode and output format for its artifact name", () => {
  assert.equal(firmwareFileName({ target: "STM32F405", release: "2026.6.2", buildMode: "target", outputExtension: "hex" }),
    "betaflight_2026.6.2_STM32F405.hex");
  assert.equal(firmwareFileName({ target: "RP2350A", release: "2026.6.2", buildMode: "target", outputExtension: "uf2" }),
    "betaflight_2026.6.2_RP2350A.uf2");
  assert.equal(firmwareFileName({ target: "ESP32S3", release: "2026.6.2", buildMode: "target", outputExtension: "bin" }),
    "betaflight_2026.6.2_ESP32S3.bin");
  assert.equal(firmwareFileName({ target: "SITL", release: "2026.6.2", buildMode: "target", outputExtension: "exe" }),
    "betaflight_2026.6.2_SITL");
});
