<script setup lang="ts">
const engine = { name: "SE550 Series Engine", description: { zh: "面向大型平台的对置双缸发动机，提供化油器与电喷版本。", en: "An opposed twin-cylinder engine for large platforms, with carbureted and EFI variants." }, rows: [
  { label: { zh: "功率", en: "Power" }, value: "36.5–37 kW / 7500 rpm" }, { label: { zh: "排量", en: "Displacement" }, value: "548 cm³" }, { label: { zh: "点火次序", en: "Ignition sequence" }, value: "Opposed twin cylinder / 180°" }, { label: { zh: "燃油混合比例", en: "Fuel mixture" }, value: "50:1" }, { label: { zh: "整机重量", en: "Weight" }, value: "19.5–20.3 kg" }
] };
</script>
<template><EngineDetailPage :engine="engine" /></template>
