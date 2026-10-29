<script setup lang="ts">
const { program } = useAttendance()
const route = useRoute()

const links = [
  { label: 'التحضير', to: '/attendance', icon: 'i-lucide-clipboard-check' },
  { label: 'التقرير والشهادات', to: '/report', icon: 'i-lucide-award' }
]
</script>

<template>
  <!-- خارج الهيدر عمداً: backdrop-filter في الهيدر يجعل أي عنصر fixed بداخله يتبع الهيدر لا الشاشة -->
  <nav
    v-if="program"
    class="fixed inset-x-0 bottom-0 z-30 border-t border-default bg-default pb-[env(safe-area-inset-bottom)] sm:hidden"
  >
    <div class="grid grid-cols-2">
      <NuxtLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        class="flex h-14 flex-col items-center justify-center gap-0.5 text-xs"
        :class="route.path === l.to ? 'font-bold text-primary' : 'text-muted'"
      >
        <UIcon
          :name="l.icon"
          class="size-5"
        />
        {{ l.label }}
      </NuxtLink>
    </div>
    <div class="flex items-center justify-center gap-2 py-4 border-t border-default bg-elevated/50 text-sm text-muted">
      <img
        src="/img/avatar.png"
        alt=""
        width="32"
        height="32"
        class="size-8 rounded-full object-cover ring-2 ring-primary/30"
      >
      برمجة وتصميم <span class="font-semibold text-default">محمد عبدالرحمن</span>
    </div>
  </nav>
</template>
