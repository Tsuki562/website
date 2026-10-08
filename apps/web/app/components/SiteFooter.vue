<script setup lang="ts">
const { isEnglish, localizedPath } = useLocale();
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-main">
      <div class="footer-brand">
        <img src="/images/site/logo.png" alt="重山航空 Great Mountain" />
        <p>{{ isEnglish ? "Reliable flight-control, RF and power systems." : "可靠的飞控、射频与航空动力系统。" }}</p>
      </div>
      <div class="footer-links">
        <div>
          <strong>{{ isEnglish ? "Products" : "产品" }}</strong>
          <NuxtLink :to="localizedPath('/flightcontrol_service/')">{{ isEnglish ? "Flight controllers" : "飞控系统" }}</NuxtLink>
          <NuxtLink :to="localizedPath('/trans_grid/')">{{ isEnglish ? "Video transmitters" : "图传系统" }}</NuxtLink>
          <NuxtLink :to="localizedPath('/g-motor/')">{{ isEnglish ? "Aero engines" : "航空发动机" }}</NuxtLink>
        </div>
        <div>
          <strong>{{ isEnglish ? "Support" : "支持" }}</strong>
          <NuxtLink :to="localizedPath('/downloads/')">{{ isEnglish ? "Download center" : "下载中心" }}</NuxtLink>
          <NuxtLink :to="`${localizedPath('/downloads/')}#build`">{{ isEnglish ? "Online build" : "在线编译" }}</NuxtLink>
          <NuxtLink :to="localizedPath('/contact/')">{{ isEnglish ? "Contact" : "联系我们" }}</NuxtLink>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>Copyright © 2026 重山航空</span>
      <span>鲁ICP备2024131452号-1</span>
      <span>Great Mountain Aviation</span>
    </div>
  </footer>
</template>
