<script setup lang="ts">
import type { Product } from "~~/shared/types/content";

const props = defineProps<{ product: Product }>();
const { text, localizedPath } = useLocale();
const imageByProduct: Record<string, string> = {
  "f435-vmt7": "/images/site/flight-controller.jpg",
  "f435-rgt7": "/images/site/flight-controller.jpg",
  "esc-45a": "/images/site/esc.jpg",
  "beacon-vtx": "/images/site/vtx.jpg",
  antenna: "/images/site/antenna.png",
  "se-engine": "/images/site/engine.png"
};
const image = computed(() => props.product.image || imageByProduct[props.product.id] || "/images/site/flight-controller.jpg");
const detailPath = computed(() => localizedPath(props.product.id === "antenna" ? "/antenna/" : props.product.href));
</script>

<template>
  <article class="product-card" :id="product.id">
    <NuxtLink :to="detailPath" class="product-image-link">
      <img :src="image" :alt="product.name" />
    </NuxtLink>
    <div class="product-card-body">
      <p class="eyebrow">{{ text(product.eyebrow) }}</p>
      <h2>{{ product.name }}</h2>
      <p>{{ text(product.description) }}</p>
      <ul class="feature-list">
        <li v-for="highlight in product.highlights" :key="highlight.zh">{{ text(highlight) }}</li>
      </ul>
      <NuxtLink class="text-link" :to="detailPath">{{ $route.path.startsWith('/en') ? "View product details" : "查看产品详情" }} →</NuxtLink>
    </div>
  </article>
</template>
