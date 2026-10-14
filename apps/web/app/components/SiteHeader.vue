<script setup lang="ts">
const { isEnglish, localizedPath } = useLocale();
const route = useRoute();
const menuOpen = ref(false);
const languageOpen = ref(false);

const menu = computed(() => [
  { label: isEnglish.value ? "Home" : "首页", to: localizedPath("/") },
  { label: isEnglish.value ? "Products" : "产品", to: localizedPath("/products/") },
  { label: isEnglish.value ? "Services & Support" : "服务与支持", to: localizedPath("/service/") },
  { label: "Betaflight", to: "/betaflight/", external: true },
  { label: isEnglish.value ? "Contact us" : "联系我们", to: localizedPath("/contact/") },
  { label: isEnglish.value ? "Join us" : "加入我们", to: `${localizedPath("/")}#whyus` }
]);

const languagePath = computed(() => (isEnglish.value ? "/" : "/en/首页-english/"));

function closeMenus() {
  menuOpen.value = false;
  languageOpen.value = false;
}

watch(() => route.fullPath, closeMenus);
</script>

<template>
  <header class="site-header" @keydown.esc="closeMenus">
    <div class="container header-inner">
      <NuxtLink class="brand" :to="localizedPath('/')" :aria-label="isEnglish ? 'Great Mountain home' : '重山航空首页'">
        <img src="/images/site/logo.png" alt="重山航空 Great Mountain" />
      </NuxtLink>

      <button
        class="mobile-menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="primary-navigation"
        :aria-label="menuOpen ? (isEnglish ? 'Close navigation' : '关闭导航') : (isEnglish ? 'Open navigation' : '打开导航')"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span><span></span>
      </button>

      <nav
        id="primary-navigation"
        class="primary-nav"
        :class="{ 'is-open': menuOpen }"
        :aria-label="isEnglish ? 'Main navigation' : '主导航'"
      >
        <template v-for="item in menu" :key="item.label">
          <a v-if="item.external" :href="item.to">{{ item.label }}</a>
          <NuxtLink v-else :to="item.to" active-class="is-active">{{ item.label }}</NuxtLink>
        </template>
      </nav>

      <div class="header-actions">
        <button
          class="language-switch"
          type="button"
          :aria-expanded="languageOpen"
          aria-controls="language-options"
          @click="languageOpen = !languageOpen"
        >
          {{ isEnglish ? "English" : "中文 (中国)" }}
          <span class="language-chevron" aria-hidden="true">⌄</span>
        </button>
        <div v-if="languageOpen" id="language-options" class="language-options">
          <NuxtLink :to="languagePath">{{ isEnglish ? "中文 (中国)" : "English" }}</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
