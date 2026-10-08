import { buildJobs, publicJob } from "../../../utils/build-jobs";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  const token = String(getQuery(event).token || "");
  const job = id ? buildJobs.get(id) : undefined;
  if (!job || !token || token !== job.accessToken) {
    throw createError({ statusCode: 404, statusMessage: "Build job not found." });
  }
  return { job: publicJob(job), download: null };
});
