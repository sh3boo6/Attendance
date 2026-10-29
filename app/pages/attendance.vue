<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'
import type { Participant } from '~/types'

const { program, isPresent, setPresent, setAll, markSaved, isSaved, presentCount } = useAttendance()
const toast = useToast()

const day = ref('1')
const session = ref('1')
const search = ref('')
const showAddParticipant = ref(false)
const newParticipant = ref({ name: '', nationalId: '', org: '' })

function toEnglishDigits(value: string) {
  return value.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

function addParticipant() {
  if (!program.value || !newParticipant.value.name.trim()) return
  program.value.participants.push({
    id: crypto.randomUUID(),
    name: newParticipant.value.name.trim(),
    nationalId: newParticipant.value.nationalId.trim(),
    org: newParticipant.value.org.trim()
  })
  newParticipant.value = { name: '', nationalId: '', org: '' }
  showAddParticipant.value = false
}
const pagination = ref({ pageIndex: 0, pageSize: 10 })
watch(search, () => {
  pagination.value.pageIndex = 0
})
watch(day, () => {
  session.value = '1'
})
watch([day, session], () => {
  pagination.value.pageIndex = 0
})

const hideSm = { class: { th: 'hidden sm:table-cell', td: 'hidden sm:table-cell tabular-nums' } }
const hideMd = { class: { th: 'hidden md:table-cell', td: 'hidden md:table-cell' } }
const columns: TableColumn<Participant>[] = [
  { accessorKey: 'name', header: 'الاسم' },
  { accessorKey: 'nationalId', header: 'رقم الهوية', meta: hideSm },
  { accessorKey: 'org', header: 'الجهة', meta: hideMd },
  { id: 'status', header: 'الحضور' }
]

const dayItems = computed(() =>
  Array.from({ length: program.value?.days ?? 0 }, (_, i) => ({ label: dayLabel(i + 1), value: String(i + 1) })))
const sessionItems = computed(() =>
  Array.from({ length: program.value?.sessionsPerDay ?? 0 }, (_, i) => ({
    label: sessionLabel(i + 1),
    value: String(i + 1),
    icon: isSaved(Number(day.value), i + 1) ? 'i-lucide-check-circle' : undefined
  })))

const d = computed(() => Number(day.value))
const s = computed(() => Number(session.value))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = program.value?.participants ?? []
  if (!q) return list
  return list.filter(p => p.name.toLowerCase().includes(q) || p.nationalId.includes(q))
})

const total = computed(() => program.value?.participants.length ?? 0)
const present = computed(() => presentCount(d.value, s.value))

function save() {
  markSaved(d.value, s.value)
  toast.add({
    title: 'تم حفظ الجلسة',
    description: `${dayLabel(d.value)} - ${sessionLabel(s.value)}: حضور ${present.value} من ${total.value}`,
    color: 'success', icon: 'i-lucide-check'
  })
}
</script>

<template>
  <div
    v-if="program"
    class="space-y-4 pb-64 sm:pb-0"
  >
    <UTabs
      v-model="day"
      :items="dayItems"
      :content="false"
      variant="pill"
      class="w-full"
      :ui="{ list: 'overflow-x-auto' }"
    />
    <UTabs
      v-model="session"
      :items="sessionItems"
      :content="false"
      color="neutral"
      variant="link"
      class="w-full"
    />

    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <template #header>
        <div class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <UBadge
                color="success"
                variant="subtle"
                :label="`حاضر ${present}`"
              />
              <UBadge
                color="error"
                variant="subtle"
                :label="`غائب ${total - present}`"
              />
              <UBadge
                v-if="isSaved(d, s)"
                color="primary"
                variant="soft"
                icon="i-lucide-check"
                label="محفوظة"
              />
            </div>
            <div class="flex gap-2">
              <UButton
                size="xs"
                color="neutral"
                variant="outline"
                label="تحضير الكل"
                icon="i-lucide-check-check"
                @click="setAll(d, s, program.participants.map(p => p.id), true)"
              />
              <UButton
                size="xs"
                color="neutral"
                variant="outline"
                label="تصفير"
                icon="i-lucide-rotate-ccw"
                @click="setAll(d, s, program.participants.map(p => p.id), false)"
              />
              <UButton
                size="xs"
                color="primary"
                variant="soft"
                label="إضافة مشارك"
                icon="i-lucide-user-plus"
                @click="showAddParticipant = true"
              />
            </div>
          </div>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="بحث بالاسم أو رقم الهوية…"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template
              v-if="search"
              #trailing
            >
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="link"
                size="sm"
                aria-label="مسح"
                @click="search = ''"
              />
            </template>
          </UInput>
        </div>
      </template>

      <UTable
        v-model:pagination="pagination"
        :data="filtered"
        :columns="columns"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :ui="{ td: 'py-2', th: 'text-start' }"
        class="w-full"
      >
        <template #name-cell="{ row }">
          <div class="font-medium">
            {{ row.original.name }}
          </div>
          <div class="text-xs text-muted md:hidden">
            <span class="sm:hidden">{{ row.original.nationalId }} · </span>{{ row.original.org }}
          </div>
        </template>
        <template #status-cell="{ row }">
          <div
            class="inline-flex gap-1"
            role="radiogroup"
            :aria-label="`حضور ${row.original.name}`"
          >
            <UButton
              size="sm"
              label="حاضر"
              role="radio"
              :aria-checked="isPresent(d, s, row.original.id)"
              :color="isPresent(d, s, row.original.id) ? 'success' : 'neutral'"
              :variant="isPresent(d, s, row.original.id) ? 'solid' : 'outline'"
              @click="setPresent(d, s, row.original.id, true)"
            />
            <UButton
              size="sm"
              label="غائب"
              role="radio"
              :aria-checked="!isPresent(d, s, row.original.id)"
              :color="!isPresent(d, s, row.original.id) ? 'error' : 'neutral'"
              :variant="!isPresent(d, s, row.original.id) ? 'solid' : 'outline'"
              @click="setPresent(d, s, row.original.id, false)"
            />
          </div>
        </template>
        <template #empty>
          <p class="py-6 text-center text-muted">
            لا توجد نتائج مطابقة
          </p>
        </template>
      </UTable>
      <TablePager
        v-model="pagination"
        :total="filtered.length"
      />
    </UCard>

    <div class="fixed inset-x-0 bottom-[calc(7.5rem+env(safe-area-inset-bottom))] z-20 border-t border-default bg-default/95 p-3 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0">
      <UButton
        label="حفظ الجلسة"
        icon="i-lucide-save"
        size="xl"
        block
        @click="save"
      />
    </div>
    <UModal
      v-model:open="showAddParticipant"
      title="إضافة مشارك"
    >
      <template #body>
        <div class="space-y-3">
          <div>
            <label class="mb-1 block text-sm font-medium">الاسم</label>
            <UInput
              v-model="newParticipant.name"
              placeholder="الاسم"
              class="w-full"
              @input="(e: Event) => newParticipant.name = toEnglishDigits((e.target as HTMLInputElement).value)"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">رقم الهوية</label>
            <UInput
              v-model="newParticipant.nationalId"
              placeholder="رقم الهوية"
              class="w-full"
              @input="(e: Event) => newParticipant.nationalId = toEnglishDigits((e.target as HTMLInputElement).value)"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">المدرسة أو جهة العمل</label>
            <UInput
              v-model="newParticipant.org"
              placeholder="المدرسة أو جهة العمل"
              class="w-full"
              @input="(e: Event) => newParticipant.org = toEnglishDigits((e.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            label="إلغاء"
            color="neutral"
            variant="outline"
            @click="showAddParticipant = false"
          />
          <UButton
            label="إضافة"
            icon="i-lucide-plus"
            :disabled="!newParticipant.name.trim()"
            @click="addParticipant"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
