<script setup lang="ts">
const engine = { name: "SE45 Series Engine", description: { zh: "轻量化 45cm³ 航空发动机，兼顾动力与可靠性。", en: "A lightweight 45cm³ aero engine balancing output and reliability." }, rows: [
  { label: { zh: "额定功率", en: "Rated power" }, value: "2.4 kW" }, { label: { zh: "总排量", en: "Displacement" }, value: "45 cm³" }, { label: { zh: "缸径 / 冲程", en: "Bore / stroke" }, value: "43 mm / 31 mm" }, { label: { zh: "额定转速", en: "Rated speed" }, value: "7500 rpm" }, { label: { zh: "整机重量", en: "Weight" }, value: "2.2 kg" }
] };
</script>
<template><EngineDetailPage :engine="engine" /></template>
