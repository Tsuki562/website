import type { BuildJob, BuildRequest } from "~~/shared/types/content";

export const buildJobs = new Map<string, BuildJob & { request: BuildRequest; accessToken: string }>();

export function publicJob(job: BuildJob) {
  return {
    id: job.id,
    status: job.status,
    createdAt: job.createdAt,
    message: job.message
  };
}
