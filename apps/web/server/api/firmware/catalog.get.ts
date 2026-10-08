import { buildPresets, downloads } from "~~/shared/data/site";

export default defineEventHandler(() => ({
  source: "demo",
  downloads,
  presets: buildPresets,
  note: "Replace with WordPress firmware records after the content plugin is installed."
}));
