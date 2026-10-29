<script setup lang="ts">
const { program } = useAttendance()
const route = useRoute()

const links = [
  { label: 'التحضير', to: '/attendance', icon: 'i-lucide-clipboard-check' },
  { label: 'التقرير والشهادات', to: '/report', icon: 'i-lucide-award' }
]
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-default bg-default/90 backdrop-blur">
    <UContainer class="flex h-14 items-center gap-3">
      <img src="/img/logo.png" alt="الشعار" class="size-8 shrink-0">
      <h1 class="min-w-0 flex-1 truncate text-base font-bold sm:text-lg">
        {{ program?.name || 'نظام التحضير' }}
      </h1>

      <nav v-if="program" class="hidden items-center gap-1 sm:flex">
        <UButton
          v-for="l in links" :key="l.to" :to="l.to" :icon="l.icon" :label="l.label"
          :variant="route.path === l.to ? 'soft' : 'ghost'" color="primary" size="sm"
        />
      </nav>

      <DataMenu v-if="program" />
      <ThemeToggle />
    </UContainer>

    <!-- تنقل سفلي للهاتف -->
    <nav
      v-if="program"
      class="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-default bg-default pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      <NuxtLink
        v-for="l in links" :key="l.to" :to="l.to"
        class="flex flex-col items-center gap-0.5 py-2 text-xs"
        :class="route.path === l.to ? 'font-bold text-primary' : 'text-muted'"
      >
        <UIcon :name="l.icon" class="size-5" />
        {{ l.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
