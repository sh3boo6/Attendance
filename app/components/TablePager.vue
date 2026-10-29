<script setup lang="ts">
const pagination = defineModel<{ pageIndex: number, pageSize: number }>({ required: true })
const props = defineProps<{ total: number }>()

const sizes = [10, 25, 50, 100].map(n => ({ label: `${n} / صفحة`, value: n }))

const page = computed({
  get: () => pagination.value.pageIndex + 1,
  set: (p: number) => { pagination.value = { ...pagination.value, pageIndex: p - 1 } }
})
const pageSize = computed({
  get: () => pagination.value.pageSize,
  set: (n: number) => { pagination.value = { pageIndex: 0, pageSize: n } }
})
</script>

<template>
  <div class="flex flex-col items-center justify-between gap-3 border-t border-default p-3 sm:flex-row">
    <div class="flex items-center gap-2 text-sm text-muted">
      <USelect
        v-model="pageSize"
        :items="sizes"
        size="sm"
        class="w-32"
      />
      <span>الإجمالي: {{ props.total }}</span>
    </div>
    <UPagination
      v-model:page="page"
      :items-per-page="pagination.pageSize"
      :total="props.total"
      size="sm"
    />
  </div>
</template>
