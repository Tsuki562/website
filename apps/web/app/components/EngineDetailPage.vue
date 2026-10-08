<script setup lang="ts">
import type { LocalizedText } from "~~/shared/types/content";

const props = defineProps<{ engine: { name: string; description: LocalizedText; rows: Array<{ label: LocalizedText; value: string }> } }>();
const { isEnglish, text, localizedPath } = useLocale();
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
        <aside class="detail-card">
          <img class="detail-product-image" src="/images/site/engine.png" :alt="props.engine.name" />
          <NuxtLink class="button-secondary" style="margin-top: 18px;" :to="localizedPath('/downloads/')">{{ isEnglish ? "Open downloads" : "查看下载资料" }}</NuxtLink>
        </aside>
      </div>
    </section>
  </div>
</template>
