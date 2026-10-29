<script setup lang="ts">
const SEEN_KEY = 'attendance:install-prompt-seen'
const { $pwa } = useNuxtApp()

const seen = ref(true)
try { seen.value = localStorage.getItem(SEEN_KEY) === '1' } catch {}

// iOS لا يدعم طلب التثبيت، فنعرض إرشاداً يدوياً بدلاً منه
const isIos = import.meta.client && /iphone|ipad|ipod/i.test(navigator.userAgent)
const standalone = import.meta.client
  && (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true)

const visible = computed(() => {
  if (seen.value || standalone || $pwa?.isPWAInstalled) return false
  return !!$pwa?.showInstallPrompt || isIos
})

// تُعرض الرسالة مرة واحدة فقط: نسجّل ذلك لحظة ظهورها
watch(visible, (v) => {
  if (v) try { localStorage.setItem(SEEN_KEY, '1') } catch {}
}, { immediate: true })

function close() {
  seen.value = true
  try { localStorage.setItem(SEEN_KEY, '1') } catch {}
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
    <div v-if="visible" class="fixed inset-x-3 bottom-28 z-40 mx-auto max-w-md sm:bottom-4 sm:start-4 sm:mx-0" role="dialog" aria-label="تثبيت التطبيق">
      <UCard :ui="{ body: 'p-4' }" class="shadow-lg">
        <div class="flex items-start gap-3">
          <img src="/img/logo.png" alt="" class="size-10 shrink-0">
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" class="order-last -mt-1" aria-label="إغلاق" @click="close" />
          <div class="min-w-0 flex-1">
            <p class="font-bold">ثبّت التطبيق</p>
            <p class="text-sm text-muted">يمكنك تحميل نظام التحضير كبرنامج على جهازك والعمل بدون إنترنت.</p>
            <p v-if="!$pwa?.showInstallPrompt && isIos" class="mt-2 text-sm">
              اضغط زر المشاركة <UIcon name="i-lucide-share" class="inline size-4 align-text-bottom" /> ثم «إضافة إلى الشاشة الرئيسية».
            </p>
            <div class="mt-3 flex gap-2">
              <UButton v-if="$pwa?.showInstallPrompt" label="تثبيت" icon="i-lucide-download" size="sm" @click="install" />
              <UButton :label="$pwa?.showInstallPrompt ? 'لاحقاً' : 'حسناً'" color="neutral" variant="ghost" size="sm" @click="close" />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </Transition>
</template>
