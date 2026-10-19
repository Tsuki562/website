<script setup lang="ts">
import type { DownloadItem } from "~~/shared/types/content";
import { channelLabels, firmwareKindLabels } from "../utils/display";

const { isEnglish, text } = useLocale();
const { data } = await useFetch<{ downloads: DownloadItem[] }>("/api/firmware/catalog", {
  default: () => ({ downloads: [] })
});

const query = ref("");
const product = ref("");
const target = ref("");
const kind = ref("");
const channel = ref("");
const hardware = ref("");
const date = ref("");

const catalog = computed(() => data.value?.downloads ?? []);
const products = computed(() => [...new Set(catalog.value.map((item) => item.productName).filter(Boolean))]);
const targets = computed(() => [...new Set(catalog.value.map((item) => item.target).filter(Boolean))]);
const hardwareVersions = computed(() => [...new Set(catalog.value.map((item) => item.hardwareVersion).filter(Boolean))]);

const results = computed(() => {
  const normalized = query.value.trim().toLowerCase();
  return catalog.value.filter((item) => {
    const searchable = [item.productName, item.target, item.version, item.fileName, item.changelog.zh, item.changelog.en].join(" ").toLowerCase();
    return (
      (!normalized || searchable.includes(normalized)) &&
      (!product.value || item.productName === product.value) &&
      (!target.value || item.target === target.value) &&
      (!kind.value || item.kind === kind.value) &&
      (!channel.value || item.channel === channel.value) &&
      (!hardware.value || item.hardwareVersion === hardware.value) &&
      (!date.value || item.releaseDate >= date.value)
    );
  });
});

const labelForKind = (item: DownloadItem) => text(firmwareKindLabels[item.kind]);
const labelForChannel = (item: DownloadItem) => text(channelLabels[item.channel]);
const changelogText = (item: DownloadItem) => text(item.changelog).trim();
const metadataText = (item: DownloadItem) => [
  item.releaseDate ? `${isEnglish.value ? "Released" : "发布日期"} ${item.releaseDate}` : "",
  item.fileSize.trim(),
  item.sha256 ? `SHA-256: ${item.sha256}` : ""
].filter(Boolean).join(" · ");

useSeoMeta({ title: () => (isEnglish.value ? "Downloads | Great Mountain" : "下载中心 | 重山航空") });
</script>

<template>
  <div>
    <PageHero
      :eyebrow="isEnglish ? 'Resources' : '资料中心'"
      :title="isEnglish ? 'Downloads and firmware' : '下载中心与固件管理'"
      :description="isEnglish ? 'Find product documents and firmware, or open the Betaflight ground station.' : '按产品、Target、固件类型和版本筛选资料，或进入 Betaflight 在线地面站。'"
    />

    <section class="container content-section">
      <div class="downloads-layout">
        <aside class="filter-panel" aria-label="下载筛选">
          <h2>{{ isEnglish ? "Filter resources" : "筛选资料" }}</h2>
          <div class="filter-field">
            <label for="download-query">{{ isEnglish ? "Keyword" : "关键词" }}</label>
            <input id="download-query" v-model="query" type="search" :placeholder="isEnglish ? 'Search...' : '搜索产品、Target或文件名'" />
          </div>
          <div class="filter-field">
            <label for="download-product">{{ isEnglish ? "Product" : "产品型号" }}</label>
            <select id="download-product" v-model="product"><option value="">{{ isEnglish ? "All products" : "全部产品" }}</option><option v-for="item in products" :key="item" :value="item">{{ item }}</option></select>
          </div>
          <div class="filter-field">
            <label for="download-target">Target</label>
            <select id="download-target" v-model="target"><option value="">{{ isEnglish ? "All targets" : "全部 Target" }}</option><option v-for="item in targets" :key="item" :value="item">{{ item }}</option></select>
          </div>
          <div class="filter-field">
            <label for="download-kind">{{ isEnglish ? "Type" : "文件类型" }}</label>
            <select id="download-kind" v-model="kind">
              <option value="">{{ isEnglish ? "All types" : "全部类型" }}</option>
              <option value="firmware">{{ isEnglish ? "Firmware" : "固件" }}</option>
              <option value="manual">{{ isEnglish ? "Manual" : "说明书" }}</option>
              <option value="wiring">{{ isEnglish ? "Wiring diagram" : "接线图" }}</option>
              <option value="driver">{{ isEnglish ? "Driver & tool" : "驱动与工具" }}</option>
              <option value="vtx-table">{{ isEnglish ? "VTX table" : "图传表" }}</option>
            </select>
          </div>
          <div class="filter-field">
            <label for="download-channel">{{ isEnglish ? "Channel" : "发布通道" }}</label>
            <select id="download-channel" v-model="channel"><option value="">{{ isEnglish ? "All channels" : "全部版本" }}</option><option value="stable">{{ isEnglish ? "Stable" : "稳定版" }}</option><option value="alpha">Alpha</option><option value="development">{{ isEnglish ? "Development" : "开发版" }}</option><option value="document">{{ isEnglish ? "Documents" : "资料" }}</option></select>
          </div>
          <div class="filter-field">
            <label for="download-hardware">{{ isEnglish ? "Hardware" : "硬件版本" }}</label>
            <select id="download-hardware" v-model="hardware"><option value="">{{ isEnglish ? "All hardware" : "全部硬件" }}</option><option v-for="item in hardwareVersions" :key="item" :value="item">{{ item }}</option></select>
          </div>
          <div class="filter-field">
            <label for="download-date">{{ isEnglish ? "Released after" : "发布日期起始" }}</label>
            <input id="download-date" v-model="date" type="date" />
          </div>
        </aside>

        <div>
          <div class="downloads-results">
            <article v-for="item in results" :key="item.id" class="download-card">
              <div class="download-card-head">
                <div>
                  <p v-if="item.productName" class="eyebrow">{{ item.productName }}</p>
                  <h2>{{ item.fileName }}</h2>
                </div>
                <span class="tag">{{ labelForChannel(item) }}</span>
              </div>
              <div class="download-card-meta">
                <span class="tag">{{ labelForKind(item) }}</span>
                <span v-if="item.version" class="tag muted">{{ item.version }}</span>
                <span v-if="item.hardwareVersion" class="tag muted">{{ item.hardwareVersion }}</span>
                <span v-if="item.target" class="tag muted">{{ item.target }}</span>
              </div>
              <p v-if="changelogText(item)">{{ changelogText(item) }}</p>
              <p v-if="metadataText(item)">{{ metadataText(item) }}</p>
              <p v-if="item.buildOptions.length">{{ isEnglish ? "Build options" : "构建选项" }}: {{ item.buildOptions.join(" / ") }}</p>
              <div class="download-card-actions">
                <a v-if="item.href" class="button-primary" :href="`/api/content/downloads/${encodeURIComponent(item.id)}/download`" :download="item.fileName">{{ isEnglish ? "Download" : "下载" }}</a>
                <span v-else class="button-secondary">{{ isEnglish ? "File migration pending" : "文件迁移待完成" }}</span>
                <span class="muted-text">{{ isEnglish ? "Downloads" : "下载次数" }}: {{ item.downloadCount }}</span>
              </div>
            </article>
            <div v-if="!results.length" class="empty-state">{{ isEnglish ? "No resources match these filters." : "没有符合筛选条件的资料。" }}</div>
          </div>

          <article id="build" class="build-card">
            <p class="eyebrow">Betaflight</p>
            <h2>{{ isEnglish ? "Connect, configure and flash" : "连接飞控、配置与刷写" }}</h2>
            <p>{{ isEnglish ? "Use the Betaflight interface to configure your controller and request firmware. Only approved Targets and options are available. Your compiled firmware is private and kept for 24 hours." : "在 Betaflight 原版界面中配置飞控与申请固件编译。仅开放管理员验证通过的 Target 和选项；生成的固件仅供本人使用，编译完成后保留 24 小时。" }}</p>
            <div class="download-card-actions"><a class="button-primary" href="/betaflight/">{{ isEnglish ? "Open Betaflight" : "进入 Betaflight" }}</a></div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
