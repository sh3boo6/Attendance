<script setup lang="ts">
import { ar } from '@nuxt/ui/locale'
</script>

<template>
  <UApp :locale="ar" :ui="{ root: 'min-h-dvh flex flex-col' }">
    <NuxtPwaManifest />
    <AppHeader />
    <UContainer class="w-full flex-1 py-4 sm:py-8">
      <NuxtPage />
    </UContainer>
    <AppFooter />
    <InstallPrompt />
  </UApp>
</template>
