<script setup lang="ts">
const engine = { name: "SE110 Series Engine", description: { zh: "适用于更大平台的双缸航空发动机系列。", en: "A twin-cylinder aero engine series for larger platforms." }, rows: [
  { label: { zh: "功率", en: "Power" }, value: "13.2 kW / 7500 rpm" }, { label: { zh: "排量", en: "Displacement" }, value: "100.2 cm³" }, { label: { zh: "转速范围", en: "Speed range" }, value: "1100–8500 rpm" }, { label: { zh: "冷却方式", en: "Cooling" }, value: "Air cooled" }, { label: { zh: "整机重量", en: "Weight" }, value: "3.1 kg" }
] };
</script>
<template><EngineDetailPage :engine="engine" /></template>
