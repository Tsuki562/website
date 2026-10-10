import { proxyFirmwareService } from "../../utils/firmware-service";
export default defineEventHandler(event => proxyFirmwareService(event, "api/builds"));
