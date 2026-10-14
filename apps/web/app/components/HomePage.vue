<script setup lang="ts">
const { isEnglish, localizedPath } = useLocale();

const currentSlide = ref(0);
const slides = computed(() => [
  { src: "/images/site/banner-1.jpg", alt: isEnglish.value ? "Flight controller product banner" : "飞控产品展示" },
  { src: "/images/site/banner-2.jpg", alt: isEnglish.value ? "Aviation products banner" : "航空产品展示" }
]);
const activeSlide = computed(() => slides.value[currentSlide.value] ?? slides.value[0]!);

const categories = computed(() => [
  {
    name: isEnglish.value ? "AT32F435 flight controllers" : "AT32F435系列飞控",
    image: "/images/site/flight-controller.jpg",
    href: "/flightcontrol_service/"
  },
  { name: isEnglish.value ? "ESC" : "电调", image: "/images/site/esc.jpg", href: "/esc-45a/" },
  {
    name: isEnglish.value ? "Beacon video transmitters" : "Beacon系列图传",
    image: "/images/site/vtx.jpg",
    href: "/trans_grid/"
  },
  { name: isEnglish.value ? "Antennas" : "天线", image: "/images/site/antenna-home-v2.png", href: "/antenna/" },
  {
    name: isEnglish.value ? "Aero engines" : "航空发动机",
    image: "/images/site/engine-home-v2.png",
    href: "/g-motor/"
  }
]);

const highlights = computed(() => [
  {
    name: isEnglish.value ? "AT32F435 flight controller" : "AT32F435系列飞控",
    points: isEnglish.value ? ["High reliability", "Thoughtful circuit design"] : ["高可靠性 · 高国产化率", "优秀的电路设计"],
    href: "/flightcontrol_service/",
    image: "/images/site/flight-controller.jpg"
  },
  {
    name: isEnglish.value ? "ESC" : "电调",
    points: isEnglish.value ? ["32-bit high-performance processor", "Six-layer 3OZ design"] : ["32位高性能处理器", "6层3OZ · C型铜条设计"],
    href: "/esc-45a/",
    image: "/images/site/esc.jpg"
  },
  {
    name: isEnglish.value ? "Beacon video transmitter" : "Beacon系列图传",
    points: isEnglish.value ? ["Multi-band 2000mW / 2500mW", "High signal-to-noise ratio"] : ["多频段 2000mW / 2500mW", "高信噪比"],
    href: "/trans_grid/",
    image: "/images/site/vtx.jpg"
  },
  {
    name: isEnglish.value ? "Custom antennas" : "天线",
    points: isEnglish.value ? ["Custom frequencies and types", "Low VSWR"] : ["频段与类型可定制", "低驻波比 · 高品质"],
    href: "/antenna/",
    image: "/images/site/antenna.png"
  },
  {
    name: isEnglish.value ? "Aero engines" : "航空发动机",
    points: isEnglish.value ? ["Strong output", "Reliable and fuel efficient"] : ["强劲动力 · 超轻重量", "可靠、稳定、燃油经济"],
    href: "/g-motor/",
    image: "/images/site/engine.png"
  }
]);

const services = computed(() => [
  {
    title: isEnglish.value ? "After-sales service" : "售后服务",
    description: isEnglish.value ? "Find product support and service information." : "查找产品支持与服务信息。",
    href: localizedPath("/service/")
  },
  {
    title: isEnglish.value ? "Manuals and downloads" : "使用说明书与下载",
    description: isEnglish.value ? "Browse manuals, wiring diagrams and public files." : "浏览说明书、接线图与公开资料。",
    href: localizedPath("/downloads/")
  },
  {
    title: isEnglish.value ? "Open-source information" : "开源资料",
    description: isEnglish.value ? "Explore the Betaflight firmware ecosystem." : "了解 Betaflight 固件生态与相关资料。",
    href: `${localizedPath("/downloads/")}#build`
  }
]);

function showSlide(index: number) {
  currentSlide.value = (index + slides.value.length) % slides.value.length;
}

useSeoMeta({
  title: () => (isEnglish.value ? "Great Mountain Aviation" : "重山航空"),
  description: () => isEnglish.value
    ? "Great Mountain flight controllers, video transmitters, antennas and aero engines."
    : "重山航空飞控、图传、天线和航空发动机产品与服务。"
});
</script>

<template>
  <div class="reference-home">
    <section class="reference-slider" :aria-label="isEnglish ? 'Featured products' : '产品展示'">
      <div class="reference-slides" aria-live="polite">
        <Transition name="reference-slide">
          <img
            :key="activeSlide.src"
            class="reference-slide-image"
            :src="activeSlide.src"
            :alt="activeSlide.alt"
          />
        </Transition>
      </div>
      <button
        class="reference-slider-arrow previous"
        type="button"
        :aria-label="isEnglish ? 'Previous banner' : '上一张展示图'"
        @click="showSlide(currentSlide - 1)"
      >
        <span aria-hidden="true">←</span>
      </button>
      <button
        class="reference-slider-arrow next"
        type="button"
        :aria-label="isEnglish ? 'Next banner' : '下一张展示图'"
        @click="showSlide(currentSlide + 1)"
      >
        <span aria-hidden="true">→</span>
      </button>
      <div class="reference-slider-dots" role="group" :aria-label="isEnglish ? 'Choose a banner' : '选择展示图'">
        <button
          v-for="(slide, index) in slides"
          :key="slide.src"
          type="button"
          :aria-label="isEnglish ? `Show banner ${index + 1}` : `显示第 ${index + 1} 张展示图`"
          :aria-pressed="currentSlide === index"
          :class="{ active: currentSlide === index }"
          @click="showSlide(index)"
        />
      </div>
    </section>

    <nav class="reference-category-strip" :aria-label="isEnglish ? 'Product categories' : '产品分类'">
      <div class="reference-category-track">
        <NuxtLink
          v-for="category in categories"
          :key="category.name"
          class="reference-category"
          :to="localizedPath(category.href)"
        >
          <span class="reference-category-image"><img :src="category.image" alt="" loading="lazy" /></span>
          <strong>{{ category.name }}</strong>
        </NuxtLink>
      </div>
    </nav>

    <section class="reference-product-section">
      <div class="container">
        <div class="reference-section-heading">
          <p class="reference-overline">{{ isEnglish ? "GREAT MOUNTAIN · FLIGHT SYSTEMS" : "重山航空 · 飞行系统" }}</p>
          <h1>{{ isEnglish ? "Products and support for reliable flight" : "专注飞行控制与航空动力" }}</h1>
        </div>
        <div class="reference-product-grid">
          <NuxtLink
            v-for="(item, index) in highlights"
            :key="item.name"
            class="reference-product-card"
            :to="localizedPath(item.href)"
          >
            <div class="reference-product-image"><img :src="item.image" alt="" loading="lazy" /></div>
            <div class="reference-product-copy">
              <span class="reference-product-number">0{{ index + 1 }}</span>
              <h2>{{ item.name }}</h2>
              <p v-for="point in item.points" :key="point">{{ point }}</p>
              <span class="reference-more">{{ isEnglish ? "Explore" : "了解更多" }} <span aria-hidden="true">→</span></span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="reference-services" id="whyus">
      <div class="container">
        <div class="reference-section-heading">
          <p class="reference-overline">{{ isEnglish ? "SERVICE · SUPPORT · DOWNLOAD" : "服务 · 支持 · 下载" }}</p>
          <h2>{{ isEnglish ? "Services and support" : "服务支持与资料下载" }}</h2>
        </div>
        <div class="reference-service-grid">
          <NuxtLink v-for="(item, index) in services" :key="item.title" :to="item.href" class="reference-service-card">
            <span class="reference-service-number">0{{ index + 1 }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <span class="reference-more">{{ isEnglish ? "View information" : "查看资料" }} <span aria-hidden="true">→</span></span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="reference-contact">
      <div class="container reference-contact-inner">
        <div>
          <p class="reference-overline">{{ isEnglish ? "CONTACT US" : "联系我们" }}</p>
          <h2>{{ isEnglish ? "Contact us for more information" : "联系我们，获取更多信息" }}</h2>
        </div>
        <NuxtLink class="reference-contact-link" :to="localizedPath('/contact/')">
          {{ isEnglish ? "Contact details" : "获取联系方式" }} <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
