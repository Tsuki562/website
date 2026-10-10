import { proxyFirmwareService } from "../../utils/firmware-service";

export default defineEventHandler(async event => {
  const path = getRouterParam(event, "path") || "";
  if (!/^api\/(targets|builds|options|releases|app)(\/|$)/.test(path)
    || path.includes("..") || path.includes("\\") || path.includes("%")) {
    throw createError({ statusCode: 404, statusMessage: "Not found." });
  }
  return proxyFirmwareService(event, path);
});
