<script setup lang="ts">
import { ar } from '@nuxt/ui/locale'

const toaster = { position: 'top-center' as const, duration: 2000, progress: false }
</script>

<template>
  <NuxtLoadingIndicator />
  <UApp
    :locale="ar"
    :toaster="toaster"
  >
    <NuxtPwaManifest />
    <div class="flex min-h-dvh flex-col">
      <AppHeader />
      <main class="flex-1">
        <UContainer class="py-4 sm:py-8">
          <NuxtPage />
        </UContainer>
      </main>
      <AppFooter />
    </div>
    <MobileNav />
    <InstallPrompt />
    <OfflineStatus />
  </UApp>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
</style>
