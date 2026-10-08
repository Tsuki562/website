"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var site_1 = require("~~/shared/data/site");
exports.default = defineEventHandler(function () { return ({
    source: "demo",
    downloads: site_1.downloads,
    presets: site_1.buildPresets,
    note: "Replace with WordPress firmware records after the content plugin is installed."
}); });
