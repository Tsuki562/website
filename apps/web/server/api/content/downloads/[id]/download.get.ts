import { getDownloadsContent } from "../../../../utils/wordpress";
import { resourceDownloadHeaders, resourceDownloadUrl } from "../../../../utils/resource-download";

export default defineEventHandler(async event => {
  const id = getRouterParam(event, "id") || "";
  if (!/^[a-z0-9][a-z0-9-]{0,199}$/.test(id)) {
    throw createError({ statusCode: 404, statusMessage: "Resource not found." });
  }

  const result = await getDownloadsContent();
  if (result.source !== "wordpress") {
    throw createError({ statusCode: 503, statusMessage: "Resource catalog is unavailable." });
  }
  const item = result.items.find(resource => resource.id === id);
  const href = item?.downloadHref || item?.href;
  if (!item || !href) {
    throw createError({ statusCode: 404, statusMessage: "Resource not found." });
  }

  let url: URL;
  try {
    url = resourceDownloadUrl(href, String(useRuntimeConfig(event).wordpressBaseUrl || ""));
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Resource location is invalid." });
  }

  let response: Response;
  try {
    // Do not forward browser cookies/auth, or follow redirects to other servers.
    response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(60_000) });
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Resource server is unavailable." });
  }
  if (response.status !== 200 || !response.body) {
    await response.body?.cancel();
    throw createError({
      statusCode: response.status === 404 ? 404 : 502,
      statusMessage: response.status === 404 ? "Resource file not found." : "Resource download failed."
    });
  }

  setHeaders(event, resourceDownloadHeaders(item.fileName));
  return sendStream(event, response.body);
});
