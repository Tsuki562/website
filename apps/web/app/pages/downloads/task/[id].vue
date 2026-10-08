<script setup lang="ts">
const route = useRoute();
const { isEnglish } = useLocale();
const token = computed(() => String(route.query.token || ""));
const jobId = computed(() => String(route.params.id));
const { data, error } = await useFetch<{ job: { status: string; message: string; createdAt: string }; download: null }>(
  () => `/api/firmware/jobs/${encodeURIComponent(jobId.value)}?token=${encodeURIComponent(token.value)}`
);
useSeoMeta({ title: () => (isEnglish.value ? "Build job | Great Mountain" : "编译任务 | 重山航空") });
</script>

<template>
  <div>
    <PageHero :eyebrow="isEnglish ? 'Build job' : '编译任务'" :title="jobId" :description="isEnglish ? 'Use the task token to view the current status and download result.' : '使用任务访问令牌查看当前状态和下载结果。'" compact />
    <section class="container content-section">
      <article class="detail-card">
        <p v-if="error" class="form-message error">{{ isEnglish ? "The task token is invalid or expired." : "任务令牌无效或已过期。" }}</p>
        <template v-else-if="data?.job">
          <p class="eyebrow">{{ isEnglish ? "Current status" : "当前状态" }}</p>
          <h2>{{ data.job.status }}</h2>
          <p>{{ data.job.message }}</p>
          <p class="muted-text">{{ isEnglish ? "Created" : "创建时间" }}: {{ data.job.createdAt }}</p>
          <span class="button-secondary">{{ isEnglish ? "Compiler integration pending" : "真实编译器待接入" }}</span>
        </template>
      </article>
    </section>
  </div>
</template>
