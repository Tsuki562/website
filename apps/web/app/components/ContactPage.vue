<script setup lang="ts">
const { isEnglish } = useLocale();
useSeoMeta({ title: () => (isEnglish.value ? "Contact | Great Mountain" : "联系我们 | 重山航空") });
</script>

<template>
  <div>
    <PageHero
      :eyebrow="isEnglish ? 'Contact' : '联系我们'"
      :title="isEnglish ? 'Government procurement and distributors' : '政企采购与经销商合作'"
      :description="isEnglish ? 'Business cooperation, custom products and product support.' : '商务合作、定制产品与产品支持。'"
    />
    <section class="container content-section">
      <div class="detail-layout">
        <article class="detail-card">
          <h2>{{ isEnglish ? "Business cooperation" : "商务合作" }}</h2>
          <p>{{ isEnglish ? "For government procurement, distribution and customized products." : "面向政企采购、渠道经销和产品定制需求。" }}</p>
          <div class="callout">{{ isEnglish ? "Contact details are pending confirmation." : "联系方式待确认后补充。" }}</div>
        </article>
        <aside class="detail-card">
          <h2>{{ isEnglish ? "Available channels" : "联系渠道" }}</h2>
          <dl>
            <dt>{{ isEnglish ? "Business phone" : "商务电话" }}</dt><dd>{{ isEnglish ? "Pending" : "待补充" }}</dd>
            <dt>{{ isEnglish ? "Email" : "电子邮箱" }}</dt><dd>{{ isEnglish ? "Pending" : "待补充" }}</dd>
            <dt>{{ isEnglish ? "Address" : "公司地址" }}</dt><dd>{{ isEnglish ? "Pending" : "待补充" }}</dd>
          </dl>
        </aside>
      </div>
    </section>
  </div>
</template>
