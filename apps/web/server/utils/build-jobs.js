"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildJobs = void 0;
exports.publicJob = publicJob;
exports.buildJobs = new Map();
function publicJob(job) {
    return {
        id: job.id,
        status: job.status,
        createdAt: job.createdAt,
        message: job.message
    };
}
