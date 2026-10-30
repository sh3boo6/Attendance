<script setup lang="ts">
const { $pwa } = useNuxtApp()
const toast = useToast()

// أول مرة تكتمل فيها التنزيلات: التطبيق جاهز للعمل بدون إنترنت
watch(() => $pwa?.offlineReady, (ready) => {
  if (ready) {
    toast.add({
      title: 'التطبيق جاهز للعمل بدون إنترنت',
      description: 'تم تحميل كل الملفات، ويمكنك استخدامه دون اتصال.',
      color: 'success',
      icon: 'i-lucide-wifi-off'
    })
  }
}, { immediate: true })

watch(() => $pwa?.registrationError, (failed) => {
  if (failed) {
    toast.add({
      title: 'تعذّر تفعيل العمل بدون إنترنت',
      description: 'أعد تحميل الصفحة بوجود الإنترنت. إن تكرر ذلك امسح بيانات الموقع.',
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
  }
}, { immediate: true })
</script>

<template>
  <span hidden />
</template>
