import type { H3Event } from "h3";

export async function proxyFirmwareService(event: H3Event, path: string) {
  if (event.method === "POST") {
    const origin = getHeader(event, "origin");
    const fetchSite = getHeader(event, "sec-fetch-site");
    if ((origin && origin !== getRequestURL(event).origin) || fetchSite === "cross-site") {
      throw createError({ statusCode: 403, statusMessage: "Cross-origin task actions are not allowed." });
    }
  }
  const base = useRuntimeConfig(event).firmwareApiBaseUrl;
  if (!base) throw createError({ statusCode: 503, statusMessage: "Firmware service is not configured." });
  const target = new URL(path.replace(/^\//, ""), `${base.replace(/\/$/, "")}/`);
  setHeader(event, "Cache-Control", "no-store");
  setHeader(event, "Referrer-Policy", "no-referrer");
  const query = getRequestURL(event).search;
  target.search = query;
  try {
    return await proxyRequest(event, target.toString(), {
      headers: { authorization: "", cookie: "" }
    });
  } catch {
    throw createError({ statusCode: 503, statusMessage: "Firmware service is unavailable." });
  }
}
