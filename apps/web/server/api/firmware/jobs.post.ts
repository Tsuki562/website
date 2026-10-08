import { randomBytes } from "node:crypto";
import type { BuildRequest } from "~~/shared/types/content";
import { buildJobs } from "../../utils/build-jobs";

const allowedRefs = new Set(["stable-4.3.4", "alpha", "development"]);
const allowedTargets = new Set(["GREATMOUNTAINF435"]);

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<BuildRequest>>(event);
  if (!body.productId || !body.target || !body.sourceRef || !body.presetId) {
    throw createError({ statusCode: 400, statusMessage: "Build request is missing required fields." });
  }
  if (!allowedTargets.has(body.target) || !allowedRefs.has(body.sourceRef)) {
    throw createError({ statusCode: 400, statusMessage: "This Target or source ref is not enabled yet." });
  }

  const id = `GM-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomBytes(3).toString("hex").toUpperCase()}`;
  const accessToken = randomBytes(24).toString("base64url");
  const createdAt = new Date().toISOString();
  const request = body as BuildRequest;
  const job = {
    id,
    accessToken,
    request,
    status: "queued" as const,
    createdAt,
    message: "任务已创建。真实 Target 验证完成后将进入编译队列。"
  };
  buildJobs.set(id, job);

  return {
    id,
    accessToken,
    status: job.status,
    message: "任务已创建，当前为框架演示任务。"
  };
});
