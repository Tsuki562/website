<script setup lang="ts">
const { isEnglish, localizedPath } = useLocale();

const menu = computed(() => [
  { label: isEnglish.value ? "Home" : "首页", to: localizedPath("/") },
  { label: isEnglish.value ? "Products" : "产品中心", to: localizedPath("/products/") },
  { label: isEnglish.value ? "Support" : "服务支持", to: localizedPath("/service/") },
  { label: isEnglish.value ? "About" : "联系我们", to: localizedPath("/contact/") }
]);

const languagePath = computed(() => (isEnglish.value ? "/" : "/en/"));
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink class="brand" :to="localizedPath('/')" aria-label="重山航空">
        <img src="/images/site/logo.png" alt="重山航空 Great Mountain" />
      </NuxtLink>

      <nav class="primary-nav" :aria-label="isEnglish ? 'Main navigation' : '主导航'">
        <NuxtLink v-for="item in menu" :key="item.to" :to="item.to" active-class="is-active">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="header-actions">
        <NuxtLink class="language-switch" :to="languagePath">{{ isEnglish ? "中" : "EN" }}</NuxtLink>
        <NuxtLink class="header-download" :to="localizedPath('/downloads/')">
          {{ isEnglish ? "Downloads" : "下载中心" }}
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
