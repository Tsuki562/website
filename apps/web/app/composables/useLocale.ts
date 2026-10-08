import type { LocalizedText, Locale } from "~~/shared/types/content";

export function useLocale() {
  const route = useRoute();
  const locale = computed<Locale>(() => (route.path.startsWith("/en/") || route.path === "/en" ? "en" : "zh-CN"));
  const isEnglish = computed(() => locale.value === "en");
  const text = (value: LocalizedText) => (isEnglish.value ? value.en : value.zh);
  const localizedPath = (path: string) => {
    if (!isEnglish.value) return path;
    if (path === "/") return "/en/";
    return `/en${path}`.replace(/\/+/g, "/");
  };

  return { locale, isEnglish, text, localizedPath };
}
