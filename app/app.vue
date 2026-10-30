<script setup lang="ts">
import { ar } from '@nuxt/ui/locale'

const toaster = { position: 'top-center' as const }
</script>

<template>
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
