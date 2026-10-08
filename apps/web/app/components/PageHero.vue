<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    description?: string;
    compact?: boolean;
  }>(),
  { eyebrow: "", description: "", compact: false }
);
</script>

<template>
  <section class="page-hero" :class="{ compact }">
    <div class="container">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p v-if="description" class="hero-description">{{ description }}</p>
      <slot />
    </div>
  </section>
</template>
