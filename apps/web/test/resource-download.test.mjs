import assert from "node:assert/strict";
import test from "node:test";
import { resourceDownloadHeaders, resourceDownloadUrl } from "../server/utils/resource-download.ts";

test("allows catalog files on the configured WordPress origin", () => {
  const href = "http://127.0.0.1:8080/wp-content/uploads/manual.pdf";
  assert.equal(resourceDownloadUrl(href, "http://127.0.0.1:8080").href, href);
});

test("rejects other origins, protocols, credentials and invalid URLs", () => {
  for (const href of [
    "http://127.0.0.1:8090/private", "https://example.com/file.pdf",
    "file:///etc/passwd", "http://user:password@127.0.0.1:8080/file", "/relative"
  ]) {
    assert.throws(() => resourceDownloadUrl(href, "http://127.0.0.1:8080"));
  }
});

test("forces attachment downloads with UTF-8 filenames", () => {
  const name = "重山AT32飞控使用说明书.pdf";
  const headers = resourceDownloadHeaders(name);
  assert.match(headers["Content-Disposition"], /^attachment; filename="[\x20-\x7e]+"; filename\*=UTF-8''/);
  assert.equal(decodeURIComponent(headers["Content-Disposition"].split("UTF-8''")[1]), name);
  assert.equal(headers["Content-Type"], "application/octet-stream");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
});

test("sanitizes header injection and path separators while encoding special characters", () => {
  const disposition = resourceDownloadHeaders('../a\\b\r\n";x=(1)\'.pdf')["Content-Disposition"];
  assert.ok(!/[\r\n]/.test(disposition));
  const name = decodeURIComponent(disposition.split("UTF-8''")[1]);
  assert.ok(!/[\/\\\r\n]/.test(name));
  assert.ok(disposition.includes("%281%29%27.pdf"));
  assert.ok(resourceDownloadHeaders("")["Content-Disposition"].includes('filename="download"'));
});
