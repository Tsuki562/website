<script setup lang="ts">
import { products } from "~~/shared/data/site";
const { isEnglish } = useLocale();
const flightControllers = products.filter((product) => product.category === "flight-controller");
</script>

<template>
  <div>
    <PageHero
      eyebrow="AT32F435"
      :title="isEnglish ? 'Flight controller service' : 'AT32F435 系列飞控'"
      :description="isEnglish ? 'Choose a controller to view firmware, manuals and flashing resources.' : '选择对应飞控型号，查看固件、说明书、接线图与刷写资料。'"
    />
    <section class="container content-section">
      <div class="card-grid">
        <ProductCard v-for="product in flightControllers" :key="product.id" :product="product" />
      </div>
    </section>
  </div>
</template>
