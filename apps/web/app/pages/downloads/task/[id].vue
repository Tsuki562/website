<script setup lang="ts">
definePageMeta({ alias: ["/en/downloads/task/:id"] });
const route = useRoute();
const { isEnglish } = useLocale();
const token = computed(() => String(route.query.token || ""));
const jobId = computed(() => String(route.params.id));
type Job = { status: string; message: string; createdAt: string; expiresAt?: string; sha256?: string; fileName?: string };
const endpoint = computed(() => `/api/firmware/jobs/${encodeURIComponent(jobId.value)}?token=${encodeURIComponent(token.value)}`);
const { data, error, refresh } = await useFetch<{ job: Job }>(endpoint);
const cancelling = ref(false);
const actionError = ref("");
const canCancel = computed(() => ["queued", "building"].includes(data.value?.job.status || ""));
const canDownload = computed(() => data.value?.job.status === "ready");
const terminal = computed(() => ["ready", "failed", "cancelled", "expired"].includes(data.value?.job.status || ""));
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => { timer = setInterval(() => { if (!terminal.value) refresh(); }, 5000); });
onBeforeUnmount(() => clearInterval(timer));
const cancel = async () => {
  cancelling.value = true;
  actionError.value = "";
  try {
    await $fetch(`/api/firmware/jobs/${encodeURIComponent(jobId.value)}/cancel?token=${encodeURIComponent(token.value)}`, { method: "POST" });
    await refresh();
  } catch {
    actionError.value = isEnglish.value ? "Unable to cancel. Please retry." : "取消失败，请重试。";
  } finally { cancelling.value = false; }
};
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
          <p v-if="data.job.expiresAt" class="muted-text">{{ isEnglish ? "Download expires" : "下载失效时间" }}: {{ data.job.expiresAt }}</p>
          <p v-if="data.job.sha256" class="muted-text">SHA-256: {{ data.job.sha256 }}</p>
          <div class="download-card-actions">
            <a v-if="canDownload" class="button-primary" :href="`/api/firmware/jobs/${encodeURIComponent(jobId)}/download?token=${encodeURIComponent(token)}`">{{ isEnglish ? "Download firmware" : "下载固件" }}</a>
            <button v-if="canCancel" class="button-secondary" type="button" :disabled="cancelling" @click="cancel">{{ cancelling ? (isEnglish ? "Cancelling..." : "正在取消...") : (isEnglish ? "Cancel job" : "取消任务") }}</button>
            <a v-if="canCancel || canDownload" class="button-secondary" :href="`/betaflight/?job=${encodeURIComponent(`${jobId}.${token}`)}`">{{ isEnglish ? "Open in Betaflight" : "在 Betaflight 中打开" }}</a>
          </div>
          <p v-if="actionError" role="alert" class="form-message error">{{ actionError }}</p>
          <p>{{ isEnglish ? "Bookmark this private task link. Firmware is kept for 24 hours after completion. Back up locally before flashing and restore from your local backup afterwards." : "请保存本任务私有链接。固件在编译完成后保留 24 小时；刷写前建议备份到本机，刷写后从本机选择备份恢复参数。" }}</p>
        </template>
      </article>
    </section>
  </div>
</template>
