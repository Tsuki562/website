import type { BuildPreset, DownloadItem, Product } from "../types/content";

export const products: Product[] = [
  {
    id: "f435-vmt7",
    category: "flight-controller",
    name: "F435 VMT7",
    eyebrow: { zh: "AT32F435 系列飞控", en: "AT32F435 flight controller" },
    description: {
      zh: "高可靠性、高国产化率与优秀电路设计的飞控平台。",
      en: "A reliable flight-control platform with a highly localized component design."
    },
    href: "/f435-vmt7_service/",
    highlights: [
      { zh: "AT32F435 处理器", en: "AT32F435 processor" },
      { zh: "支持 Betaflight", en: "Betaflight support" },
      { zh: "说明书与接线图", en: "Manuals and wiring diagrams" }
    ]
  },
  {
    id: "f435-rgt7",
    category: "flight-controller",
    name: "F435 RGT7",
    eyebrow: { zh: "AT32F435 系列飞控", en: "AT32F435 flight controller" },
    description: {
      zh: "面向多旋翼平台的 AT32 飞控，提供固件、驱动与刷写资料。",
      en: "An AT32 flight controller with firmware, drivers and flashing resources."
    },
    href: "/f435-rgt7_service/",
    highlights: [
      { zh: "标准版与扩展版本", en: "Standard and extended variants" },
      { zh: "固件资料集中管理", en: "Centralized firmware resources" },
      { zh: "后续支持在线编译", en: "Online builds planned" }
    ]
  },
  {
    id: "esc-45a",
    category: "esc",
    name: "45A ESC",
    eyebrow: { zh: "高性能电调", en: "High-performance ESC" },
    description: {
      zh: "32位高性能处理器与六层 3OZ 电路设计。",
      en: "32-bit processing with a six-layer, 3OZ circuit design."
    },
    href: "/esc-45a/",
    highlights: [
      { zh: "C型铜条", en: "C-shaped copper busbar" },
      { zh: "超高电流设计", en: "High-current design" }
    ]
  },
  {
    id: "beacon-vtx",
    category: "video-transmitter",
    name: "Beacon",
    eyebrow: { zh: "多频段图传", en: "Multi-band video transmitter" },
    description: {
      zh: "覆盖多种频段与功率规格的模拟图传产品系列。",
      en: "Analog video transmitters spanning several bands and output levels."
    },
    href: "/trans_grid/",
    highlights: [
      { zh: "2000mW / 2500mW", en: "2000mW / 2500mW" },
      { zh: "高信噪比", en: "High signal-to-noise ratio" }
    ]
  },
  {
    id: "antenna",
    category: "antenna",
    name: "定制天线",
    eyebrow: { zh: "天线", en: "Antenna" },
    description: {
      zh: "支持频段与结构形式定制，兼顾低驻波比与一致性。",
      en: "Custom frequencies and formats with low VSWR and consistent quality."
    },
    href: "/products/#antenna",
    highlights: [
      { zh: "可定制频段", en: "Custom frequencies" },
      { zh: "可定制类型", en: "Custom formats" }
    ]
  },
  {
    id: "se-engine",
    category: "engine",
    name: "SE 系列发动机",
    eyebrow: { zh: "航空发动机", en: "Aero engine" },
    description: {
      zh: "覆盖 SE45 至 SE550 的航空发动机产品系列。",
      en: "Aero engines ranging from the SE45 through the SE550."
    },
    href: "/g-motor/",
    highlights: [
      { zh: "强劲动力", en: "Strong output" },
      { zh: "可靠稳定", en: "Reliable and stable" },
      { zh: "燃油经济", en: "Fuel efficient" }
    ]
  }
];

export const downloads: DownloadItem[] = [
  {
    id: "f435-vmt7-manual",
    productId: "f435-vmt7",
    productName: "F435 VMT7",
    target: "待确认",
    kind: "manual",
    channel: "document",
    hardwareVersion: "VMT7",
    version: "公开资料",
    releaseDate: "2025-08-25",
    fileName: "重山AT32飞控使用说明书.pdf",
    fileSize: "8.81 MB",
    sha256: "迁移文件后自动计算",
    downloadCount: 0,
    changelog: { zh: "现有官网公开使用说明书。", en: "Public flight controller manual." },
    buildOptions: []
  },
  {
    id: "f435-rgt7-bf-432",
    productId: "f435-rgt7",
    productName: "F435 RGT7",
    target: "GREATMOUNTAINF435",
    kind: "firmware",
    channel: "stable",
    hardwareVersion: "RGT7 标准版",
    version: "4.3.2",
    releaseDate: "2025-08-25",
    fileName: "ATBF_4.3.2_Great-MountainF435-RGT7.hex",
    fileSize: "523.33 KB",
    sha256: "迁移文件后自动计算",
    downloadCount: 0,
    changelog: { zh: "现有官网公开 Betaflight 固件。", en: "Public Betaflight firmware from the current site." },
    buildOptions: ["标准版"]
  },
  {
    id: "f435-vmt7-bf-434",
    productId: "f435-vmt7",
    productName: "F435 VMT7",
    target: "GREATMOUNTAINF435",
    kind: "firmware",
    channel: "stable",
    hardwareVersion: "VMT7 双舵机版",
    version: "4.3.4",
    releaseDate: "2025-08-25",
    fileName: "ATBF4.3.4_Great-Mountain-F435VMT7.hex",
    fileSize: "529.27 KB",
    sha256: "迁移文件后自动计算",
    downloadCount: 0,
    changelog: { zh: "双舵机版本，实际 Target 与构建配置待确认。", en: "Dual-servo variant; target and build settings require verification." },
    buildOptions: ["双舵机版"]
  },
  {
    id: "beacon-58-2w-table",
    productId: "beacon-vtx",
    productName: "Beacon 5.8G 2W",
    target: "不适用",
    kind: "vtx-table",
    channel: "document",
    hardwareVersion: "5.8G 2W",
    version: "公开资料",
    releaseDate: "2025-11-27",
    fileName: "GreatMountain-Beacon-5.8G-2W.json",
    fileSize: "784 B",
    sha256: "迁移文件后自动计算",
    downloadCount: 0,
    changelog: { zh: "Beacon 图传表。", en: "Beacon VTX table." },
    buildOptions: []
  }
];

export const buildPresets: BuildPreset[] = [
  {
    id: "great-mountain-f435-preview",
    label: { zh: "F435 验证配置（暂不可编译）", en: "F435 verified profile (build unavailable)" },
    description: {
      zh: "已发现 GREATMOUNTAINF435 配置，但 RGT7、VMT7 和双舵机差异尚未完成硬件验证。",
      en: "GREATMOUNTAINF435 exists, but RGT7, VMT7 and dual-servo differences are not verified."
    },
    options: [
      { id: "receiver", label: { zh: "接收机协议", en: "Receiver" }, values: ["CRSF", "SBUS", "IBUS"] },
      { id: "gps", label: { zh: "GPS", en: "GPS" }, values: ["启用", "禁用"] },
      { id: "osd", label: { zh: "OSD", en: "OSD" }, values: ["启用", "禁用"] },
      { id: "blackbox", label: { zh: "Blackbox", en: "Blackbox" }, values: ["启用", "禁用"] },
      { id: "language", label: { zh: "语言", en: "Language" }, values: ["English", "简体中文"] }
    ]
  }
];
