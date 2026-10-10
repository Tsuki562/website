import { proxyFirmwareService } from "../../../../utils/firmware-service";

export default defineEventHandler(event => {
  const id = getRouterParam(event, "id") || "";
  if (!/^[a-f0-9]{32}$/.test(id)) throw createError({ statusCode: 404, statusMessage: "Task not found." });
  return proxyFirmwareService(event, `jobs/${id}/download`);
});
