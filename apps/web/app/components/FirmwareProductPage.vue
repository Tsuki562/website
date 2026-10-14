<script setup lang="ts">
import { products as demoProducts } from "~~/shared/data/site";
import type { Product } from "~~/shared/types/content";

const props = defineProps<{ productId: string }>();
const { isEnglish, text, localizedPath } = useLocale();
const { data: productResult } = await useFetch<{ products: Product[]; source: string }>("/api/content/products", {
  default: () => ({ products: [], source: "empty" })
});

const product = computed(() => {
  const current = productResult.value?.products.find((item) => item.id === props.productId);
  if (current) return current;
  return productResult.value?.source === "wordpress" ? null : demoProducts.find((item) => item.id === props.productId) ?? null;
});

const imageByProduct: Record<string, string> = {
  "f435-vmt7": "/images/site/flight-controller.jpg",
  "f435-rgt7": "/images/site/flight-controller.jpg",
  "esc-45a": "/images/site/esc.jpg",
  "beacon-vtx": "/images/site/vtx.jpg",
  antenna: "/images/site/antenna.png",
  "se-engine": "/images/site/engine.png"
};
const image = computed(() => product.value?.image || imageByProduct[props.productId] || "/images/site/flight-controller.jpg");
const includeSharedFlightControlDocs = computed(() => ["f435-rgt7", "f435-vmt7"].includes(props.productId));

useSeoMeta({
  title: () => product.value ? `${product.value.name} | ${isEnglish.value ? "Great Mountain" : "重山航空"}` : (isEnglish.value ? "Product | Great Mountain" : "产品 | 重山航空"),
  description: () => product.value ? text(product.value.description) : ""
});
</script>

<template>
  <div v-if="product">
    <PageHero :eyebrow="text(product.eyebrow)" :title="product.name" compact />

    <section class="container content-section product-detail-page">
      <div class="product-detail-overview">
        <div class="product-detail-copy">
          <p class="eyebrow">{{ isEnglish ? "PRODUCT OVERVIEW" : "产品介绍" }}</p>
          <h2>{{ isEnglish ? "Product overview" : "产品概况" }}</h2>
          <p class="product-detail-description">{{ text(product.description) }}</p>
          <div class="product-detail-actions">
            <NuxtLink class="button-primary" :to="localizedPath('/downloads/')">
              {{ isEnglish ? "Browse downloads" : "查看下载资料" }} <span aria-hidden="true">↗</span>
            </NuxtLink>
            <NuxtLink class="button-secondary" :to="localizedPath('/contact/')">
              {{ isEnglish ? "Product inquiry" : "产品咨询" }}
            </NuxtLink>
          </div>
        </div>
        <figure class="product-detail-visual">
          <img :src="image" :alt="product.name" />
          <figcaption><span>{{ text(product.eyebrow) }}</span></figcaption>
        </figure>
      </div>

      <section class="product-highlights" aria-labelledby="product-highlights-title">
        <div class="product-section-heading">
          <div>
            <p class="eyebrow">{{ isEnglish ? "KEY INFORMATION" : "产品信息" }}</p>
            <h2 id="product-highlights-title">{{ isEnglish ? "At a glance" : "产品特点" }}</h2>
          </div>
        </div>
        <ul v-if="product.highlights.length" class="product-highlight-grid">
          <li v-for="(highlight, index) in product.highlights" :key="highlight.zh" class="product-highlight">
            <span class="product-highlight-index">{{ String(index + 1).padStart(2, "0") }}</span>
            <p>{{ text(highlight) }}</p>
          </li>
        </ul>
        <div v-else class="empty-state">{{ isEnglish ? "More product information will be added." : "更多产品信息将持续补充。" }}</div>
      </section>

      <ProductDownloads
        :product-id="product.id"
        :include-general-ids="includeSharedFlightControlDocs ? ['fc-at32-manual', 'fc-wiring-14-305', 'fc-wiring-20-race'] : []"
      />

      <div class="product-detail-footnote">
        <span>{{ isEnglish ? "Need help choosing a variant or document?" : "需要确认产品版本或资料适用范围？" }}</span>
        <NuxtLink class="text-link" :to="localizedPath('/contact/')">{{ isEnglish ? "Contact Great Mountain" : "联系重山航空" }} →</NuxtLink>
      </div>
    </section>
  </div>
  <section v-else class="container content-section empty-state">
    {{ isEnglish ? "This product is not published in the content catalog." : "该产品尚未在内容目录中发布。" }}
  </section>
</template>
