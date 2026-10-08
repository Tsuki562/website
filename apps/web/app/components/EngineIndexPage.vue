<script setup lang="ts">
const { isEnglish, localizedPath } = useLocale();
const engines = [
  { id: "se45", name: "SE45", href: "/g-motor-se45/", spec: "2.4 kW · 45 cm³" },
  { id: "se110", name: "SE110", href: "/g-motor-se110/", spec: "13.2 kW · 100.2 cm³" },
  { id: "se170", name: "SE170", href: "/g-motor-se170/", spec: "13.2 kW · 170 cm³" },
  { id: "se275", name: "SE275", href: "/g-motor-se275/", spec: "16 kW · 274 cm³" },
  { id: "se550", name: "SE550", href: "/g-motor-se550/", spec: "36.5 kW · 548 cm³" }
];
</script>

<template>
  <div>
    <PageHero
      :eyebrow="isEnglish ? 'Aero engine' : '航空发动机'"
      :title="isEnglish ? 'SE series aero engines' : 'SE 系列航空发动机'"
      :description="isEnglish ? 'Strong output, low weight and reliable operation for demanding aviation applications.' : '强劲动力、超轻重量、可靠稳定，覆盖多种航空应用场景。'"
    />
    <section class="container content-section">
      <div class="card-grid">
        <article v-for="engine in engines" :key="engine.id" class="resource-card">
          <div class="resource-icon">SE</div>
          <p class="eyebrow">{{ isEnglish ? "Aero engine" : "航空发动机" }}</p>
          <h2>{{ engine.name }}</h2>
          <p>{{ engine.spec }}</p>
          <NuxtLink class="text-link" :to="localizedPath(engine.href)">{{ isEnglish ? "View specifications" : "查看技术参数" }} →</NuxtLink>
        </article>
      </div>
    </section>
  </div>
</template>
