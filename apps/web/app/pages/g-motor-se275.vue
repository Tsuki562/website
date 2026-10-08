<script setup lang="ts">
const engine = { name: "SE275 系列发动机", description: { zh: "支持化油器版与电喷版的高功率航空发动机。", en: "A high-output aero engine available in carbureted and EFI variants." }, rows: [
  { label: { zh: "功率", en: "Power" }, value: "16 kW / 7500 rpm" },
  { label: { zh: "排量", en: "Displacement" }, value: "274 cm³" },
  { label: { zh: "冷却方式", en: "Cooling" }, value: "风冷 / Air cooled" },
  { label: { zh: "燃油混合比例", en: "Fuel mixture" }, value: "50:1" },
  { label: { zh: "整机重量", en: "Weight" }, value: "7.9–8.6 kg" }
] };
</script>
<template><EngineDetailPage :engine="engine" /></template>
