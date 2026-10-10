import test from "node:test";
import assert from "node:assert/strict";
import { validateRequest } from "../config.mjs";

const profile = {
  target: "MATEKF722", release: "2026.6.2", commit: "e0b7bb01b17b21351057e9ead2d1ab39dd44fa16",
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
