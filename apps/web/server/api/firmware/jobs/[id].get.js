"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var build_jobs_1 = require("../../../utils/build-jobs");
exports.default = defineEventHandler(function (event) {
    var id = getRouterParam(event, "id");
    var token = String(getQuery(event).token || "");
    var job = id ? build_jobs_1.buildJobs.get(id) : undefined;
    if (!job || !token || token !== job.accessToken) {
        throw createError({ statusCode: 404, statusMessage: "Build job not found." });
    }
    return { job: (0, build_jobs_1.publicJob)(job), download: null };
});
