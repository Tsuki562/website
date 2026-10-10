<script setup lang="ts">
import type { Product } from "~~/shared/types/content";
const { isEnglish } = useLocale();
const { data } = await useFetch<{ products: Product[] }>("/api/content/products", {
  default: () => ({ products: [] })
});
const flightControllers = computed(() => (data.value?.products ?? []).filter((product) => product.category === "flight-controller"));
</script>

<template>
  <div>
    <PageHero
      eyebrow="AT32F435"
      :title="isEnglish ? 'Flight controller service' : 'AT32F435 系列飞控'"
      :description="isEnglish ? 'Choose a controller to view firmware, manuals and flashing resources.' : '选择对应飞控型号，查看固件、说明书、接线图与刷写资料。'"
    />
    <section class="container content-section">
      <div v-if="flightControllers.length" class="card-grid">
        <ProductCard v-for="product in flightControllers" :key="product.id" :product="product" />
      </div>
      <div v-else class="empty-state">
        {{ isEnglish ? "No published flight controllers are available yet." : "WordPress 中暂无已发布的飞控产品。" }}
      </div>
    </section>
  </div>
</template>
