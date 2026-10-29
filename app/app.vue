<script setup lang="ts">
import { ar } from '@nuxt/ui/locale'

// لون شريط حالة الجوال يتبع الوضع الفاتح/الداكن (نفس خلفية الهيدر)
const colorMode = useColorMode()
useHead({
  meta: [{
    key: 'theme-color',
    name: 'theme-color',
    content: computed(() => colorMode.value === 'dark' ? '#0f172b' : '#ffffff')
  }]
})
</script>

<template>
  <UApp :locale="ar" :ui="{ root: 'min-h-dvh flex flex-col' }">
    <NuxtPwaManifest />
    <AppHeader />
    <UContainer class="w-full flex-1 py-4 sm:py-8">
      <NuxtPage />
    </UContainer>
    <AppFooter />
    <MobileNav />
    <InstallPrompt />
  </UApp>
</template>
