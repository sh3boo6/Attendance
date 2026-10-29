<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'
import type { ReportRow } from '~/types'

const { program, report, totalSessions } = useAttendance()
const toast = useToast()

const search = ref('')
const filter = ref<'all' | 'eligible' | 'not'>('all')
const pagination = ref({ pageIndex: 0, pageSize: 10 })
watch([search, filter], () => {
  pagination.value.pageIndex = 0
})

const columns: TableColumn<ReportRow>[] = [
  { id: 'name', header: 'الاسم' },
  { id: 'org', header: 'الجهة', meta: { class: { th: 'hidden md:table-cell', td: 'hidden md:table-cell' } } },
  { id: 'attended', header: 'الحضور' },
  { id: 'percent', header: 'النسبة' },
  { id: 'eligible', header: 'الاستحقاق' }
]

const filterItems = [
  { label: 'الكل', value: 'all' },
  { label: 'مستحق', value: 'eligible' },
  { label: 'غير مستحق', value: 'not' }
]

const eligibleCount = computed(() => report.value.filter(r => r.eligible).length)

const rows = computed(() => {
  const q = search.value.trim().toLowerCase()
  return report.value.filter((r) => {
    if (filter.value === 'eligible' && !r.eligible) return false
    if (filter.value === 'not' && r.eligible) return false
    return !q || r.participant.name.toLowerCase().includes(q) || r.participant.nationalId.includes(q)
  })
})

async function exportXlsx() {
  if (!program.value) return
  const n = await exportEligible(program.value.name, report.value)
  toast.add({ title: `تم تصدير ${n} مشارك مستحق`, color: 'success', icon: 'i-lucide-check' })
}
</script>

<template>
  <div
    v-if="program"
    class="space-y-4 pb-44 sm:pb-0"
  >
    <div class="grid grid-cols-3 gap-3">
      <UCard :ui="{ body: 'p-3 sm:p-4 text-center' }">
        <div class="text-2xl font-bold">
          {{ report.length }}
        </div>
        <div class="text-xs text-muted">
          المشاركون
        </div>
      </UCard>
      <UCard :ui="{ body: 'p-3 sm:p-4 text-center' }">
        <div class="text-2xl font-bold text-success">
          {{ eligibleCount }}
        </div>
        <div class="text-xs text-muted">
          مستحقون
        </div>
      </UCard>
      <UCard :ui="{ body: 'p-3 sm:p-4 text-center' }">
        <div class="text-2xl font-bold text-error">
          {{ report.length - eligibleCount }}
        </div>
        <div class="text-xs text-muted">
          غير مستحقين
        </div>
      </UCard>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <template #header>
        <div class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm text-muted">
              إجمالي الجلسات: {{ totalSessions }} · شرط الاستحقاق: ٪{{ PASS_PERCENT }} فأعلى
            </p>
            <UButton
              label="تصدير المستحقين (Excel)"
              icon="i-lucide-file-down"
              :disabled="!eligibleCount"
              @click="exportXlsx"
            />
          </div>
          <div class="flex flex-col gap-2 sm:flex-row">
            <UInput
              v-model="search"
              icon="i-lucide-search"
              placeholder="بحث بالاسم أو رقم الهوية…"
              class="flex-1"
            />
            <USelect
              v-model="filter"
              :items="filterItems"
              class="sm:w-40"
            />
          </div>
        </div>
      </template>

      <UTable
        v-model:pagination="pagination"
        :data="rows"
        :columns="columns"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :ui="{ td: 'py-2', th: 'text-start' }"
        class="w-full"
      >
        <template #name-cell="{ row }">
          <div class="font-medium">
            {{ row.original.participant.name }}
          </div>
          <div class="text-xs text-muted tabular-nums">
            {{ row.original.participant.nationalId }}
          </div>
        </template>
        <template #org-cell="{ row }">
          {{ row.original.participant.org }}
        </template>
        <template #attended-cell="{ row }">
          <span class="tabular-nums">{{ row.original.attended }} / {{ row.original.total }}</span>
        </template>
        <template #percent-cell="{ row }">
          <div class="min-w-24">
            <div class="mb-1 text-xs font-semibold tabular-nums">
              {{ Math.round(row.original.percent) }}%
            </div>
            <UProgress
              :model-value="row.original.percent"
              size="xs"
              :color="row.original.eligible ? 'success' : 'error'"
            />
          </div>
        </template>
        <template #eligible-cell="{ row }">
          <UBadge
            :color="row.original.eligible ? 'success' : 'error'"
            variant="subtle"
            :icon="row.original.eligible ? 'i-lucide-award' : 'i-lucide-x'"
            :label="row.original.eligible ? 'مستحق للشهادة' : 'غير مستحق'"
          />
        </template>
        <template #empty>
          <p class="py-6 text-center text-muted">
            لا توجد نتائج
          </p>
        </template>
      </UTable>
      <TablePager
        v-model="pagination"
        :total="rows.length"
      />
    </UCard>
  </div>
</template>
