// Only catalog entries on the configured WordPress server may be fetched.
// Never accept a destination URL from the download request itself.
export function resourceDownloadUrl(href: string, wordpressBaseUrl: string): URL {
  const base = new URL(wordpressBaseUrl);
  const url = new URL(href);
  if (!["http:", "https:"].includes(url.protocol)
    || url.origin !== base.origin || url.username || url.password) {
    throw new TypeError("Invalid resource origin");
  }
  return url;
}

export function resourceDownloadHeaders(fileName: string): Record<string, string> {
  const name = fileName.toWellFormed().replace(/[\x00-\x1f\x7f/\\]/g, "_") || "download";
  const fallback = name.replace(/[^\x20-\x7e]|[";]/g, "_");
  const encoded = encodeURIComponent(name).replace(/['()*]/g, character =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  return {
    "Content-Disposition": `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`,
    "Content-Type": "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store"
  };
}
