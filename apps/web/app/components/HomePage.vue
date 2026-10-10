<script setup lang="ts">
const { isEnglish, localizedPath } = useLocale();

const categories = computed(() => [
  {
    name: isEnglish.value ? "AT32F435 flight controllers" : "AT32F435 系列飞控",
    label: isEnglish.value ? "Flight control" : "飞控系统",
    description: isEnglish.value
      ? "High-performance domestic flight control built for reliable and expandable platforms."
      : "面向可靠飞行与灵活扩展打造的高性能国产飞控平台。",
    image: "/images/site/flight-controller.jpg",
    href: localizedPath("/flightcontrol_service/"),
    className: "featured"
  },
  {
    name: isEnglish.value ? "SE aero engines" : "SE 系列航空发动机",
    label: isEnglish.value ? "Power system" : "动力系统",
    description: isEnglish.value
      ? "A complete engine family from SE45 through SE550."
      : "覆盖 SE45 至 SE550 的航空发动机产品系列。",
    image: "/images/site/engine-home-v2.png",
    href: localizedPath("/g-motor/"),
    className: "featured engine"
  },
  {
    name: isEnglish.value ? "High-current ESC" : "高性能电调",
    label: "ESC",
    description: isEnglish.value ? "32-bit processing and a six-layer 3OZ design." : "32 位处理器与六层 3OZ 大电流设计。",
    image: "/images/site/esc.jpg",
    href: localizedPath("/esc-45a/"),
    className: "compact"
  },
  {
    name: isEnglish.value ? "Beacon video transmitters" : "Beacon 系列图传",
    label: "VTX",
    description: isEnglish.value ? "Multi-band, high-output analog video transmission." : "多频段、高功率、高信噪比模拟图传。",
    image: "/images/site/vtx.jpg",
    href: localizedPath("/trans_grid/"),
    className: "compact"
  },
  {
    name: isEnglish.value ? "Custom antennas" : "定制天线",
    label: isEnglish.value ? "RF system" : "射频系统",
    description: isEnglish.value ? "Custom frequency bands and structures with low VSWR." : "支持频段与结构定制，兼顾低驻波与一致性。",
    image: "/images/site/antenna-home-v2.png",
    href: localizedPath("/products/#antenna"),
    className: "compact antenna"
  }
]);

const supportItems = computed(() => [
  {
    number: "01",
    title: isEnglish.value ? "Firmware center" : "固件下载中心",
    description: isEnglish.value ? "Filter verified firmware by product, Target and hardware revision." : "按产品、Target 与硬件版本查找经过审核的固件。",
    href: localizedPath("/downloads/")
  },
  {
    number: "02",
    title: isEnglish.value ? "Online Betaflight build" : "在线编译 Betaflight",
    description: isEnglish.value ? "Choose an approved Target, source version and supported build options." : "选择已验证的 Target、源码版本与可用构建选项。",
    href: `${localizedPath("/downloads/")}#build`
  },
  {
    number: "03",
    title: isEnglish.value ? "Manuals and support" : "说明书与技术支持",
    description: isEnglish.value ? "Find wiring documents, product manuals and after-sales assistance." : "集中获取接线资料、产品说明书与售后支持。",
    href: localizedPath("/service/")
  }
]);

useSeoMeta({
  title: () => (isEnglish.value ? "Great Mountain Aviation" : "重山航空"),
  description: () =>
    isEnglish.value
      ? "Great Mountain flight control, video transmission and aero engine products."
      : "重山航空飞控、图传、天线和航空发动机产品与服务。"
});
</script>

<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="home-hero-media" aria-hidden="true">
        <img src="/images/site/banner-1.jpg" alt="" />
      </div>
      <div class="home-hero-grid" aria-hidden="true"></div>
      <div class="container home-hero-inner">
        <div class="home-hero-copy">
          <p class="hero-kicker">GREAT MOUNTAIN · FLIGHT SYSTEMS</p>
          <h1 v-if="isEnglish">Engineered for<br /><em>reliable flight.</em></h1>
          <h1 v-else>为可靠飞行<br /><em>重新定义控制核心</em></h1>
          <p class="hero-lead">
            {{ isEnglish
              ? "Domestic high-performance flight controllers, video transmission and power systems — designed as one dependable platform."
              : "从高性能国产飞控，到图传与动力系统，以完整可靠的硬件平台支撑每一次飞行。" }}
          </p>
          <div class="hero-actions">
            <NuxtLink class="button-primary button-large" :to="localizedPath('/products/')">
              {{ isEnglish ? "Explore products" : "查看产品" }}
              <span aria-hidden="true">↗</span>
            </NuxtLink>
            <NuxtLink class="button-ghost button-large" :to="localizedPath('/downloads/')">
              {{ isEnglish ? "Firmware & downloads" : "固件与下载" }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="home-hero-index" aria-hidden="true"><strong>01</strong><span>/ 02</span></div>
    </section>

    <section class="home-proof" aria-label="核心能力">
      <div class="container home-proof-grid">
        <div><strong>AT32F435</strong><span>{{ isEnglish ? "High-performance MCU" : "高性能国产主控" }}</span></div>
        <div><strong>Betaflight</strong><span>{{ isEnglish ? "Firmware ecosystem" : "成熟固件生态" }}</span></div>
        <div><strong>RGT7 / VMT7</strong><span>{{ isEnglish ? "Flight-control platforms" : "飞控硬件平台" }}</span></div>
        <div><strong>SE45—SE550</strong><span>{{ isEnglish ? "Aero engine family" : "航空发动机系列" }}</span></div>
      </div>
    </section>

    <section class="home-products">
      <div class="container">
        <div class="home-section-heading">
          <div>
            <p class="section-index">01 — {{ isEnglish ? "PRODUCT SYSTEM" : "产品体系" }}</p>
            <h2>{{ isEnglish ? "Built as a complete system" : "不止单一硬件，构建完整飞行系统" }}</h2>
          </div>
          <p>{{ isEnglish ? "Flight control, RF and power products developed around real operational needs." : "围绕真实飞行需求，覆盖控制、射频与动力的完整产品组合。" }}</p>
        </div>

        <div class="home-product-grid">
          <NuxtLink
            v-for="(category, index) in categories"
            :key="category.name"
            :to="category.href"
            class="home-product-card"
            :class="category.className"
          >
            <img :src="category.image" :alt="category.name" />
            <span class="product-card-shade"></span>
            <span class="product-card-number">0{{ index + 1 }}</span>
            <span class="product-card-copy">
              <small>{{ category.label }}</small>
              <strong>{{ category.name }}</strong>
              <span>{{ category.description }}</span>
            </span>
            <span class="product-card-arrow" aria-hidden="true">↗</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="services" class="home-support">
      <div class="container">
        <div class="home-section-heading light">
          <div>
            <p class="section-index">02 — {{ isEnglish ? "SUPPORT" : "服务支持" }}</p>
            <h2>{{ isEnglish ? "From documentation to firmware" : "从资料查询到固件构建" }}</h2>
          </div>
          <p>{{ isEnglish ? "A clearer path to verified files, build jobs and technical assistance." : "让经过审核的文件、编译任务和技术支持更容易被找到。" }}</p>
        </div>
        <div class="home-support-grid">
          <NuxtLink v-for="item in supportItems" :key="item.number" :to="item.href" class="support-item">
            <span class="support-number">{{ item.number }}</span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
            <span class="support-arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="contact" class="home-contact">
      <div class="container home-contact-inner">
        <div>
          <p class="section-index">03 — {{ isEnglish ? "CONTACT" : "联系我们" }}</p>
          <h2>{{ isEnglish ? "Have a product or integration question?" : "有产品选型或系统集成需求？" }}</h2>
        </div>
        <NuxtLink class="contact-link" :to="localizedPath('/contact/')">
          <span>{{ isEnglish ? "Talk to us" : "与我们联系" }}</span>
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
