<script setup lang="ts">
const colorMode = useColorMode()

const options = [
  { label: 'تلقائي (حسب الجهاز)', value: 'system', icon: 'i-lucide-monitor' },
  { label: 'فاتح', value: 'light', icon: 'i-lucide-sun' },
  { label: 'داكن', value: 'dark', icon: 'i-lucide-moon' }
]

const items = computed(() => [options.map(o => ({
  label: o.label,
  icon: o.icon,
  type: 'checkbox' as const,
  checked: colorMode.preference === o.value,
  onSelect: () => { colorMode.preference = o.value }
}))])

const current = computed(() => options.find(o => o.value === colorMode.preference) ?? options[0]!)
</script>

<template>
  <ClientOnly>
    <UDropdownMenu :items="items" :content="{ align: 'end' }">
      <UButton :icon="current.icon" color="neutral" variant="ghost" aria-label="مظهر التطبيق" />
    </UDropdownMenu>
    <template #fallback><div class="size-8" /></template>
  </ClientOnly>
</template>
