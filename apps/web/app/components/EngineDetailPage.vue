<script setup lang="ts">
import type { LocalizedText } from "~~/shared/types/content";

const props = defineProps<{ engine: { name: string; description: LocalizedText; rows: Array<{ label: LocalizedText; value: string }> } }>();
const { isEnglish, text } = useLocale();
</script>

<template>
  <div>
    <PageHero :eyebrow="isEnglish ? 'Aero engine' : '航空发动机'" :title="props.engine.name" :description="text(props.engine.description)" compact />
    <section class="container content-section">
      <div class="detail-layout">
        <article class="detail-card">
          <p class="eyebrow">{{ isEnglish ? "Technical specifications" : "技术参数" }}</p>
          <h2>{{ isEnglish ? "Engine data" : "发动机信息" }}</h2>
          <dl>
            <template v-for="row in props.engine.rows" :key="row.label.zh">
              <dt>{{ text(row.label) }}</dt><dd>{{ row.value }}</dd>
            </template>
          </dl>
        </article>
        <aside class="detail-card engine-detail-visual">
          <img class="detail-product-image" src="/images/site/engine.png" :alt="props.engine.name" />
          <p>{{ isEnglish ? "Part of the Great Mountain SE aero engine family." : "重山航空 SE 系列航空发动机产品。" }}</p>
        </aside>
      </div>

      <ProductDownloads product-id="se-engine" />
    </section>
  </div>
</template>
