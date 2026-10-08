<script setup lang="ts">
const engine = { name: "SE170 Series Engine", description: { zh: "面向大型航空模型的高功率发动机。", en: "A high-output engine for larger aviation models." }, rows: [
  { label: { zh: "功率", en: "Power" }, value: "13.2 kW / 7500 rpm" }, { label: { zh: "排量", en: "Displacement" }, value: "170 cm³" }, { label: { zh: "转速范围", en: "Speed range" }, value: "1100–8500 rpm" }, { label: { zh: "点火电压", en: "Ignition voltage" }, value: "12–48 V" }, { label: { zh: "整机重量", en: "Weight" }, value: "3.9 kg" }
] };
</script>
<template><EngineDetailPage :engine="engine" /></template>
