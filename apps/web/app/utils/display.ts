export const firmwareKindLabels = {
  firmware: { zh: "固件", en: "Firmware" },
  manual: { zh: "使用说明书", en: "Manual" },
  wiring: { zh: "接线图", en: "Wiring" },
  driver: { zh: "驱动与工具", en: "Driver & tool" },
  "vtx-table": { zh: "图传表", en: "VTX table" }
} as const;

export const channelLabels = {
  stable: { zh: "稳定版", en: "Stable" },
  alpha: { zh: "Alpha", en: "Alpha" },
  development: { zh: "开发版", en: "Development" },
  document: { zh: "资料", en: "Document" }
} as const;
