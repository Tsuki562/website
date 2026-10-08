export default defineNuxtConfig({
  compatibilityDate: "2026-09-30",
  devtools: { enabled: true },
  ssr: true,
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    wordpressBaseUrl: process.env.WORDPRESS_BASE_URL || "",
    firmwareApiBaseUrl: process.env.FIRMWARE_API_BASE_URL || "",
    public: {
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || "重山航空",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      defaultLocale: "zh-CN"
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: "zh-CN" },
      meta: [
        {
          name: "description",
          content: "重山航空飞控、图传、天线与航空发动机产品服务中心。"
        }
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap"
        }
      ]
    }
  },
  nitro: {
    routeRules: {
      "/api/**": { cors: true },
      "/.home": { redirect: { to: "/", statusCode: 301 } },
      "/.product": { redirect: { to: "/products/", statusCode: 301 } },
      "/test/": { redirect: { to: "/flightcontrol_service/", statusCode: 301 } },
      "/69-2/": { redirect: { to: "/products/", statusCode: 301 } },
      "/sample-page/": { redirect: { to: "/", statusCode: 301 } },
      "/service-gps/": { redirect: { to: "/service/", statusCode: 302 } }
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
});
