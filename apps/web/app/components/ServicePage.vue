<script setup lang="ts">
const { isEnglish, localizedPath } = useLocale();
const resources = computed(() => [
  {
    title: { zh: "AT32F435 系列飞控", en: "AT32F435 flight controllers" },
    description: { zh: "飞控说明书、接线图、固件与刷机工具。", en: "Manuals, wiring diagrams, firmware and flashing tools." },
    href: localizedPath("/flightcontrol_service/")
  },
  {
    title: { zh: "电调", en: "ESC" },
    description: { zh: "电调产品说明与相关技术资料。", en: "ESC product and technical resources." },
    href: localizedPath("/esc-45a/")
  },
  {
    title: { zh: "Beacon 系列图传", en: "Beacon video transmitters" },
    description: { zh: "说明书、接线图、故障排查与图传表。", en: "Manuals, wiring, troubleshooting and VTX tables." },
    href: localizedPath("/trans_grid/")
  },
  {
    title: { zh: "天线", en: "Antennas" },
    description: { zh: "定制频段与产品支持资料。", en: "Custom frequencies and product support." },
    href: localizedPath("/antenna/")
  },
  {
    title: { zh: "航空发动机", en: "Aero engines" },
    description: { zh: "SE 系列发动机规格与服务入口。", en: "SE engine specifications and support." },
    href: localizedPath("/g-motor/")
  },
  {
    title: { zh: "下载中心", en: "Download center" },
    description: { zh: "统一筛选产品资料、固件和工具。", en: "Filter product resources, firmware and tools." },
    href: localizedPath("/downloads/")
  }
]);
</script>

<template>
  <ResourcePage
    :eyebrow="isEnglish ? 'Service' : '服务支持'"
    :title="isEnglish ? 'Service and support' : '服务与支持'"
    :description="isEnglish ? 'Product documentation, firmware and technical support in one place.' : '集中提供产品资料、固件下载和技术支持。'"
    :resources="resources"
  />
</template>
