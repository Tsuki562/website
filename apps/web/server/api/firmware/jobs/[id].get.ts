import { proxyFirmwareService } from "../../../utils/firmware-service";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (id && /^[a-f0-9]{32}$/.test(id)) return proxyFirmwareService(event, `jobs/${id}`);
  throw createError({ statusCode: 404, statusMessage: "Build job not found." });
});
