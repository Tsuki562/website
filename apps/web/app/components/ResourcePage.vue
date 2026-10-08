<script setup lang="ts">
import type { LocalizedText } from "~~/shared/types/content";

defineProps<{
  eyebrow: string;
  title: string;
  description: string;
  resources: Array<{ title: LocalizedText; description: LocalizedText; href?: string }>;
}>();

const { text } = useLocale();
</script>

<template>
  <div>
    <PageHero :eyebrow="eyebrow" :title="title" :description="description" />
    <section class="container content-section">
      <div class="resource-grid">
        <article v-for="resource in resources" :key="resource.title.zh" class="resource-card">
          <div class="resource-icon" aria-hidden="true">↗</div>
          <h2>{{ text(resource.title) }}</h2>
          <p>{{ text(resource.description) }}</p>
          <NuxtLink v-if="resource.href" class="text-link" :to="resource.href">
            {{ $route.path.startsWith('/en') ? "Open" : "查看" }} →
          </NuxtLink>
          <span v-else class="coming-soon">{{ $route.path.startsWith('/en') ? "Content pending" : "内容待迁移" }}</span>
        </article>
      </div>
    </section>
  </div>
</template>
