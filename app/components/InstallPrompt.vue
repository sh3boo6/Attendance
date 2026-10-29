<script setup lang="ts">
const SEEN_KEY = 'attendance:install-prompt-seen'
const { $pwa } = useNuxtApp()

const seen = ref(true)
try { seen.value = localStorage.getItem(SEEN_KEY) === '1' } catch {}

const visible = computed(() => !seen.value && !!$pwa?.showInstallPrompt && !$pwa?.isPWAInstalled)

// تُعرض الرسالة مرة واحدة فقط: نسجّل ذلك لحظة ظهورها
watch(visible, (v) => {
  if (v) try { localStorage.setItem(SEEN_KEY, '1') } catch {}
}, { immediate: true })

function close() {
  seen.value = true
  $pwa?.cancelInstall()
}

async function install() {
  seen.value = true
  await $pwa?.install()
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300" enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-200" leave-to-class="translate-y-4 opacity-0"
  >
    <div v-if="visible" class="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-md sm:bottom-4 sm:start-4 sm:mx-0" role="dialog" aria-label="تثبيت التطبيق">
      <UCard :ui="{ body: 'p-4' }" class="shadow-lg">
        <div class="flex items-start gap-3">
          <img src="/img/logo.png" alt="" class="size-10 shrink-0">
          <div class="min-w-0 flex-1">
            <p class="font-bold">ثبّت التطبيق</p>
            <p class="text-sm text-muted">يمكنك تحميل نظام التحضير كبرنامج على جهازك والعمل بدون إنترنت.</p>
            <div class="mt-3 flex gap-2">
              <UButton label="تثبيت" icon="i-lucide-download" size="sm" @click="install" />
              <UButton label="لاحقاً" color="neutral" variant="ghost" size="sm" @click="close" />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </Transition>
</template>
