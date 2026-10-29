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
      <img
        src="/img/logo.png"
        alt="الشعار"
        class="size-8 shrink-0"
      >
      <h1 class="min-w-0 flex-1 truncate text-base font-bold sm:text-lg">
        {{ program?.name || 'نظام التحضير' }}
      </h1>

      <nav
        v-if="program"
        class="hidden items-center gap-1 sm:flex"
      >
        <UButton
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :icon="l.icon"
          :label="l.label"
          :variant="route.path === l.to ? 'soft' : 'ghost'"
          color="primary"
          size="sm"
        />
      </nav>

      <DataMenu />
      <UColorModeButton />
    </UContainer>
  </header>
</template>
