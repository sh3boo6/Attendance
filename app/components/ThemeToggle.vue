<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (v: boolean) => { colorMode.preference = v ? 'dark' : 'light' }
})
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
      color="neutral" variant="ghost"
      :aria-label="isDark ? 'الوضع الفاتح' : 'الوضع الداكن'"
      @click="isDark = !isDark"
    />
    <template #fallback><div class="size-8" /></template>
  </ClientOnly>
</template>
