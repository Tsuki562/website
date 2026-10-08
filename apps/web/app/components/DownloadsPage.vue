<script setup lang="ts">
import type { BuildPreset, DownloadItem } from "~~/shared/types/content";
import { channelLabels, firmwareKindLabels } from "../utils/display";

const { isEnglish, text, localizedPath } = useLocale();
const { data } = await useFetch<{ downloads: DownloadItem[]; presets: BuildPreset[] }>("/api/firmware/catalog", {
  default: () => ({ downloads: [], presets: [] })
});

const query = ref("");
const product = ref("");
const target = ref("");
const kind = ref("");
const channel = ref("");
const hardware = ref("");
const date = ref("");

const catalog = computed(() => data.value?.downloads ?? []);
const presets = computed(() => data.value?.presets ?? []);
const products = computed(() => [...new Set(catalog.value.map((item) => item.productName))]);
const targets = computed(() => [...new Set(catalog.value.map((item) => item.target))]);
const hardwareVersions = computed(() => [...new Set(catalog.value.map((item) => item.hardwareVersion))]);

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

const selectedPreset = computed(() => presets.value[0]);
const buildForm = reactive({
  productId: "f435-vmt7",
  target: "GREATMOUNTAINF435",
  sourceRef: "stable-4.3.4",
  presetId: "great-mountain-f435-preview",
  notificationEmail: "",
  options: {
    receiver: "CRSF",
    gps: "启用",
    osd: "启用",
    blackbox: "启用",
    language: "简体中文"
  } as Record<string, string>
});
const buildSubmitting = ref(false);
const buildMessage = ref("");
const buildError = ref(false);

const submitBuild = async () => {
  buildSubmitting.value = true;
  buildMessage.value = "";
  buildError.value = false;
  try {
    const result = await $fetch<{ id: string; accessToken: string; message: string }>("/api/firmware/jobs", {
      method: "POST",
      body: buildForm
    });
    buildMessage.value = `${result.message} ${isEnglish.value ? "Job" : "任务"}: ${result.id}`;
  } catch (error) {
    buildError.value = true;
    buildMessage.value = error instanceof Error ? error.message : isEnglish.value ? "Unable to submit job." : "提交任务失败。";
  } finally {
    buildSubmitting.value = false;
  }
};

const labelForKind = (item: DownloadItem) => text(firmwareKindLabels[item.kind]);
const labelForChannel = (item: DownloadItem) => text(channelLabels[item.channel]);

useSeoMeta({ title: () => (isEnglish.value ? "Downloads | Great Mountain" : "下载中心 | 重山航空") });
</script>

<template>
  <div>
    <PageHero
      :eyebrow="isEnglish ? 'Resources' : '资料中心'"
      :title="isEnglish ? 'Downloads and firmware' : '下载中心与固件管理'"
      :description="isEnglish ? 'Find product documents, verified firmware and the online Betaflight build entry.' : '按产品、Target、固件类型和版本筛选资料，并预留在线 Betaflight 编译入口。'"
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
              <option value="vtx-table">{{ isEnglish ? "VTX table" : "图传表" }}</option>
            </select>
          </div>
          <div class="filter-field">
            <label for="download-channel">{{ isEnglish ? "Channel" : "发布通道" }}</label>
            <select id="download-channel" v-model="channel"><option value="">{{ isEnglish ? "All channels" : "全部版本" }}</option><option value="stable">{{ isEnglish ? "Stable" : "稳定版" }}</option><option value="alpha">Alpha</option><option value="development">{{ isEnglish ? "Development" : "开发版" }}</option></select>
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
                  <p class="eyebrow">{{ item.productName }}</p>
                  <h2>{{ item.fileName }}</h2>
                </div>
                <span class="tag">{{ labelForChannel(item) }}</span>
              </div>
              <div class="download-card-meta">
                <span class="tag">{{ labelForKind(item) }}</span>
                <span class="tag muted">{{ item.version }}</span>
                <span class="tag muted">{{ item.hardwareVersion }}</span>
                <span class="tag muted">{{ item.target }}</span>
              </div>
              <p>{{ text(item.changelog) }}</p>
              <p>{{ isEnglish ? "Released" : "发布日期" }} {{ item.releaseDate }} · {{ item.fileSize }} · SHA-256: {{ item.sha256 }}</p>
              <p v-if="item.buildOptions.length">{{ isEnglish ? "Build options" : "构建选项" }}: {{ item.buildOptions.join(" / ") }}</p>
              <div class="download-card-actions">
                <a v-if="item.href" class="button-primary" :href="item.href" download>{{ isEnglish ? "Download" : "下载" }}</a>
                <span v-else class="button-secondary">{{ isEnglish ? "File migration pending" : "文件迁移待完成" }}</span>
                <span class="muted-text">{{ isEnglish ? "Downloads" : "下载次数" }}: {{ item.downloadCount }}</span>
              </div>
            </article>
            <div v-if="!results.length" class="empty-state">{{ isEnglish ? "No resources match these filters." : "没有符合筛选条件的资料。" }}</div>
          </div>

          <article id="build" class="build-card">
            <p class="eyebrow">{{ isEnglish ? "Online build (scaffold)" : "在线编译（框架入口）" }}</p>
            <h2>{{ isEnglish ? "Build a Betaflight firmware" : "按 Target 编译 Betaflight 固件" }}</h2>
            <p>{{ isEnglish ? "Only administrator-approved repositories, refs and verified option combinations will be accepted. The real F435 build remains disabled until target hardware is verified." : "仅接受管理员配置的仓库、提交和验证过的选项组合。真实 F435 Target 完成硬件确认前，编译任务只作为流程演示。" }}</p>
            <form class="build-form" @submit.prevent="submitBuild">
              <label>
                {{ isEnglish ? "Product" : "产品" }}
                <select v-model="buildForm.productId"><option value="f435-vmt7">F435 VMT7</option><option value="f435-rgt7">F435 RGT7</option></select>
              </label>
              <label>
                Target
                <input v-model="buildForm.target" readonly />
              </label>
              <label>
                {{ isEnglish ? "Source ref" : "源码版本" }}
                <select v-model="buildForm.sourceRef"><option value="stable-4.3.4">4.3.4 stable</option><option value="alpha">Alpha (pending)</option><option value="development">Development (pending)</option></select>
              </label>
              <label>
                {{ isEnglish ? "Verified preset" : "验证配置" }}
                <select v-model="buildForm.presetId"><option v-for="preset in presets" :key="preset.id" :value="preset.id">{{ text(preset.label) }}</option></select>
              </label>
              <div v-if="selectedPreset" class="full option-list">
                <label v-for="option in selectedPreset.options" :key="option.id">
                  <span>{{ text(option.label) }}</span>
                  <select v-model="buildForm.options[option.id]"><option v-for="value in option.values" :key="value" :value="value">{{ value }}</option></select>
                </label>
              </div>
              <label>
                {{ isEnglish ? "Email (optional)" : "邮箱（可选）" }}
                <input v-model="buildForm.notificationEmail" type="email" placeholder="name@example.com" />
              </label>
              <div class="full">
                <button class="button-primary" type="submit" :disabled="buildSubmitting">{{ buildSubmitting ? (isEnglish ? "Submitting…" : "提交中…") : (isEnglish ? "Submit build job" : "提交编译任务") }}</button>
              </div>
              <p v-if="buildMessage" class="form-message" :class="{ error: buildError }">{{ buildMessage }}</p>
            </form>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
