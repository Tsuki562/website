<script setup lang="ts">
import type { DownloadItem } from "~~/shared/types/content";
import { firmwareKindLabels } from "../utils/display";

const props = defineProps<{ productId: string; includeGeneralIds?: string[] }>();
const { isEnglish, text, localizedPath } = useLocale();
const { data } = await useFetch<{ downloads: DownloadItem[]; source: string }>("/api/content/downloads", {
  default: () => ({ downloads: [], source: "empty" })
});

const resources = computed(() => (data.value?.downloads ?? []).filter((item) => {
  if (item.productId === props.productId) return true;
  return !item.productId && Boolean(props.includeGeneralIds?.includes(item.id));
}));
const labelForKind = (item: DownloadItem) => text(firmwareKindLabels[item.kind]);
const centerPath = computed(() => localizedPath("/downloads/"));
</script>

<template>
  <section class="product-download-section" aria-labelledby="product-downloads-title">
    <div class="product-section-heading">
      <div>
        <p class="eyebrow">{{ isEnglish ? "DOCUMENTS & FILES" : "说明书与下载" }}</p>
        <h2 id="product-downloads-title">{{ isEnglish ? "Product resources" : "相关资料" }}</h2>
      </div>
      <NuxtLink class="text-link" :to="centerPath">{{ isEnglish ? "Open download center" : "打开下载中心" }} →</NuxtLink>
    </div>

    <div v-if="resources.length" class="product-download-grid">
      <article v-for="item in resources" :key="item.id" class="product-download-card" :class="{ 'has-preview': item.kind === 'wiring' && item.href }">
        <div class="product-download-type">{{ labelForKind(item) }}</div>
        <a v-if="item.kind === 'wiring' && item.href" class="product-download-preview" :href="item.href" target="_blank" rel="noopener" :aria-label="`${item.fileName} preview`">
          <img :src="item.href" :alt="item.fileName" loading="lazy" />
        </a>
        <div class="product-download-copy">
          <h3>{{ item.fileName }}</h3>
          <p v-if="item.hardwareVersion || item.version">
            {{ [item.hardwareVersion, item.version].filter(Boolean).join(" · ") }}
          </p>
          <p v-if="item.fileSize">{{ isEnglish ? "File size" : "文件大小" }} · {{ item.fileSize }}</p>
        </div>
        <a v-if="item.href" class="button-primary" :href="item.href" :download="item.fileName">
          {{ isEnglish ? "Download" : "直接下载" }} <span aria-hidden="true">↓</span>
        </a>
        <NuxtLink v-else class="button-secondary" :to="centerPath">{{ isEnglish ? "View resource" : "查看资料" }}</NuxtLink>
      </article>
    </div>

    <div v-else class="product-download-empty">
      <div>
        <strong>{{ isEnglish ? "No product-specific files are listed yet." : "当前暂无单独关联到该产品的文件。" }}</strong>
        <p>{{ isEnglish ? "The download center may still contain general manuals and resources." : "下载中心仍可查找通用说明书、接线图及其他公开资料。" }}</p>
      </div>
      <NuxtLink class="button-secondary" :to="centerPath">{{ isEnglish ? "Browse all resources" : "浏览全部资料" }} →</NuxtLink>
    </div>
  </section>
</template>
