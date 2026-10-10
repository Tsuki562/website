<script setup lang="ts">
import type { Product } from "~~/shared/types/content";

const { isEnglish } = useLocale();
const { data } = await useFetch<{ products: Product[]; source: string }>("/api/content/products", {
  default: () => ({ products: [], source: "empty" })
});
const products = computed(() => data.value?.products ?? []);
useSeoMeta({ title: () => (isEnglish.value ? "Products | Great Mountain" : "产品 | 重山航空") });
</script>

<template>
  <div>
    <PageHero
      :eyebrow="isEnglish ? 'Product system' : '产品体系'"
      :title="isEnglish ? 'Products built for flight' : '为飞行任务打造的产品体系'"
      :description="isEnglish ? 'Flight control, power, video transmission, antennas and aero engines.' : '覆盖飞控、动力、图传、天线与航空发动机的产品组合。'"
    />
    <section class="container content-section">
      <div v-if="products.length" class="card-grid">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
      <div v-else class="empty-state">
        {{ isEnglish ? "No published products are available yet." : "WordPress 产品目录中暂无已发布产品。" }}
      </div>
    </section>
  </div>
</template>
