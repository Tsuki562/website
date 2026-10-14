import type { LocalizedText, Locale } from "~~/shared/types/content";

export function useLocale() {
  const route = useRoute();
  const locale = computed<Locale>(() => (route.path.startsWith("/en/") || route.path === "/en" ? "en" : "zh-CN"));
  const isEnglish = computed(() => locale.value === "en");
  const text = (value: LocalizedText) => (isEnglish.value ? value.en : value.zh);
  const localizedPath = (path: string) => {
    if (!isEnglish.value) return path;
    const englishRoutes: Record<string, string> = {
      "/": "/en/首页-english/",
      "/products/": "/en/products-3/",
      "/service/": "/en/services/",
      "/contact/": "/en/contact-en/",
      "/antenna/": "/en/antenna/",
      "/downloads/": "/en/downloads/"
    };
    return englishRoutes[path] ?? `/en${path}`.replace(/\/+/g, "/");
  };

  return { locale, isEnglish, text, localizedPath };
}
