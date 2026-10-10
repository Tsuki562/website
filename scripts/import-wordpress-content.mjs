#!/usr/bin/env node
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

const manifestArgument = process.argv[2];
if (!manifestArgument) {
  throw new Error("Usage: node scripts/import-wordpress-content.mjs <content-manifest.json> [--publish]");
}

const publish = process.argv.includes("--publish");
const siteUrl = (process.env.WORDPRESS_BASE_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
const credentials = [process.env.WORDPRESS_USERNAME, process.env.WORDPRESS_APP_PASSWORD];
const site = new URL(siteUrl);
if (site.protocol !== "http:" || !["127.0.0.1", "localhost", "[::1]"].includes(site.hostname)) {
  throw new Error("For safety, the migration importer only sends credentials to local HTTP WordPress (127.0.0.1/localhost).");
}
if (credentials.some((value) => !value)) {
  throw new Error("Set WORDPRESS_USERNAME and WORDPRESS_APP_PASSWORD to a local WordPress Application Password.");
}

const manifestPath = await realpath(path.resolve(manifestArgument));
const manifestDirectory = path.dirname(manifestPath);
const repositoryRoot = await realpath(path.resolve(path.dirname(new URL(import.meta.url).pathname), ".."));
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (!Array.isArray(manifest.products) || !Array.isArray(manifest.downloads)) {
  throw new Error("Manifest must contain products and downloads arrays.");
}

const authorization = `Basic ${Buffer.from(`${credentials[0]}:${credentials[1]}`).toString("base64")}`;
const status = publish ? "publish" : "draft";

function apiUrl(endpoint, query = "") {
  const [route, inlineQuery = ""] = endpoint.split("?", 2);
  const url = new URL(`${siteUrl}/`);
  url.searchParams.set("rest_route", `/${route}`);
  for (const [key, value] of new URLSearchParams(`${inlineQuery}${query}`)) url.searchParams.set(key, value);
  return url.toString();
}

async function request(endpoint, options = {}) {
  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers: {
      Authorization: authorization,
      ...(options.body instanceof Uint8Array ? {} : { "Content-Type": "application/json" }),
      ...options.headers
    },
    signal: AbortSignal.timeout(30000)
  });
  const body = await response.text();
  let value;
  try {
    value = body ? JSON.parse(body) : null;
  } catch {
    value = body;
  }
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${endpoint} failed (${response.status}): ${JSON.stringify(value).slice(0, 500)}`);
  }
  return value;
}

async function localFile(filePath) {
  if (typeof filePath !== "string" || !filePath.trim()) return null;
  const resolvedPath = await realpath(path.resolve(manifestDirectory, filePath));
  const relative = path.relative(repositoryRoot, resolvedPath);
  if (relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`File must be inside the website repository: ${filePath}`);
  }
  return { resolvedPath, content: await readFile(resolvedPath) };
}

function contentType(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  return ({
    ".pdf": "application/pdf",
    ".hex": "text/plain",
    ".json": "application/json",
    ".zip": "application/zip",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml"
  })[extension] || "application/octet-stream";
}

async function uploadMedia(filePath) {
  const file = await localFile(filePath);
  if (!file) return 0;
  const name = path.basename(file.resolvedPath);
  const search = await request(`wp/v2/media?slug=${encodeURIComponent(name.replace(/\.[^.]+$/, ""))}&_fields=id`);
  if (Array.isArray(search) && search.length) return Number(search[0].id);

  const response = await fetch(apiUrl("wp/v2/media"), {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Disposition": `attachment; filename="${name.replaceAll('"', "")}"`,
      "Content-Type": contentType(name)
    },
    body: file.content,
    signal: AbortSignal.timeout(120000)
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`Media upload ${name} failed (${response.status}): ${JSON.stringify(body).slice(0, 500)}`);
  return Number(body.id);
}

async function upsertRecord(restBase, record, data, featuredMedia = 0) {
  if (!record || typeof record.id !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(record.id)) {
    throw new Error(`Each ${restBase} record needs a lowercase slug-style id.`);
  }
  const found = await request(`wp/v2/${restBase}?slug=${encodeURIComponent(record.id)}&_fields=id`);
  const existingId = Array.isArray(found) && found.length ? Number(found[0].id) : 0;
  const endpoint = existingId ? `wp/v2/${restBase}/${existingId}` : `wp/v2/${restBase}`;
  const body = {
    slug: record.id,
    title: record.name || record.fileName || record.id,
    status,
    meta: { cshk_data: data }
  };
  if (featuredMedia) body.featured_media = featuredMedia;
  const saved = await request(endpoint, { method: "POST", body: JSON.stringify(body) });
  console.log(`${existingId ? "Updated" : "Created"} ${restBase}/${saved.slug} (${status})`);
}

for (const record of manifest.products) {
  const imageMediaId = await uploadMedia(record.imageFile);
  const data = {
    category: record.category,
    eyebrow: record.eyebrow,
    description: record.description,
    href: record.href,
    highlights: record.highlights || []
  };
  await upsertRecord("cshk-product", record, data, imageMediaId);
}

for (const record of manifest.downloads) {
  const fileMediaId = await uploadMedia(record.filePath);
  const data = {
    product_id: record.productId,
    target: record.target || "",
    kind: record.kind,
    channel: record.channel,
    hardware_version: record.hardwareVersion || "",
    version: record.version || "",
    release_date: record.releaseDate || "",
    file_name: record.fileName,
    file_size: record.fileSize || "",
    sha256: record.sha256 || "",
    download_count: Number(record.downloadCount || 0),
    changelog: record.changelog || { zh: "", en: "" },
    build_options: record.buildOptions || [],
    file_media_id: fileMediaId
  };
  await upsertRecord("cshk-download", record, data);
}

if (manifest.products.length + manifest.downloads.length === 0) {
  console.log("Manifest is empty; no WordPress content was changed.");
}

