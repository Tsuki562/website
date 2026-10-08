<script setup lang="ts">
import { downloads, products } from "~~/shared/data/site";
const props = defineProps<{ productId: string }>();
const { isEnglish, text, localizedPath } = useLocale();
const product = computed(() => products.find((item) => item.id === props.productId) ?? products[0]!);
const productDownloads = computed(() => downloads.filter((item) => item.productId === props.productId));
const imageByProduct: Record<string, string> = {
  "f435-vmt7": "/images/site/flight-controller.jpg",
  "f435-rgt7": "/images/site/flight-controller.jpg",
  "esc-45a": "/images/site/esc.jpg",
  "beacon-vtx": "/images/site/vtx.jpg"
};
</script>

<template>
  <div>
    <PageHero :eyebrow="text(product.eyebrow)" :title="product.name" :description="text(product.description)" />
    <section class="container content-section">
      <div class="detail-layout">
        <article class="detail-card">
          <p class="eyebrow">{{ isEnglish ? "Product support" : "产品支持" }}</p>
          <h2>{{ isEnglish ? "Resources for this product" : "该产品的公开资料" }}</h2>
          <p>{{ isEnglish ? "The public files below are being migrated into the new download center." : "以下公开文件正在迁移到新的下载中心。" }}</p>
          <ul class="spec-list"><li v-for="highlight in product.highlights" :key="highlight.zh"><span>{{ text(highlight) }}</span><strong>✓</strong></li></ul>
        </article>
        <aside class="detail-card">
          <img class="detail-product-image" :src="imageByProduct[product.id] || '/images/site/flight-controller.jpg'" :alt="product.name" />
          <NuxtLink class="button-primary" style="margin-top: 18px;" :to="localizedPath('/downloads/')">{{ isEnglish ? "Open download center" : "进入下载中心" }}</NuxtLink>
        </aside>
      </div>
      <div v-if="productDownloads.length" class="section-heading" style="margin-top: 62px;">
        <div><p class="eyebrow">{{ isEnglish ? "Related files" : "相关文件" }}</p><h2>{{ isEnglish ? "Public resources" : "公开资料" }}</h2></div>
      </div>
      <div v-if="productDownloads.length" class="downloads-results">
        <article v-for="item in productDownloads" :key="item.id" class="download-card">
          <div class="download-card-head"><div><h2>{{ item.fileName }}</h2><p>{{ item.version }} · {{ item.hardwareVersion }} · {{ item.fileSize }}</p></div><span class="tag">{{ item.channel }}</span></div>
        </article>
      </div>
    </section>
  </div>
</template>
