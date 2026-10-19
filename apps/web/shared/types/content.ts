export type Locale = "zh-CN" | "en";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface Product {
  id: string;
  category: "flight-controller" | "esc" | "video-transmitter" | "antenna" | "engine";
  name: string;
  eyebrow: LocalizedText;
  description: LocalizedText;
  href: string;
  image?: string;
  highlights: LocalizedText[];
}

export type FirmwareChannel = "stable" | "alpha" | "development";
export type DownloadKind = "firmware" | "manual" | "wiring" | "driver" | "vtx-table";

export interface DownloadItem {
  id: string;
  productId: string;
  productName: string;
  target: string;
  kind: DownloadKind;
  channel: FirmwareChannel | "document";
  hardwareVersion: string;
  version: string;
  releaseDate: string;
  fileName: string;
  fileSize: string;
  sha256: string;
  downloadCount: number;
  changelog: LocalizedText;
  buildOptions: string[];
  href?: string;
  downloadHref?: string;
}

export interface BuildPreset {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  options: Array<{
    id: string;
    label: LocalizedText;
    values: string[];
  }>;
}

export interface BuildRequest {
  productId: string;
  target: string;
  sourceRef: string;
  presetId: string;
  options: Record<string, string>;
  notificationEmail?: string;
}

export interface BuildJob {
  id: string;
  accessToken: string;
  status: "queued" | "building" | "ready" | "failed" | "downloaded" | "expired";
  createdAt: string;
  message: string;
}
