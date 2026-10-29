<script setup lang="ts">
import type { Participant } from '~/types'

const { program, createProgram } = useAttendance()
const toast = useToast()

const name = ref('')
const days = ref(1)
const sessionsPerDay = ref(1)
const participants = ref<Participant[]>([])
const showAddParticipant = ref(false)
const newParticipant = ref({ name: '', nationalId: '', org: '' })

function toEnglishDigits(value: string) {
  return value.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

function addParticipant() {
  if (!newParticipant.value.name.trim()) return
  participants.value.push({
    id: crypto.randomUUID(),
    name: newParticipant.value.name.trim(),
    nationalId: newParticipant.value.nationalId.trim(),
    org: newParticipant.value.org.trim()
  })
  newParticipant.value = { name: '', nationalId: '', org: '' }
  showAddParticipant.value = false
}
const fileName = ref('')
const loading = ref(false)
const confirmReplace = ref(false)

async function onExcel(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    loading.value = true
    participants.value = await parseParticipants(file)
    fileName.value = file.name
    if (!participants.value.length) {
      toast.add({ title: 'لم يُعثر على مشاركين في الملف', color: 'warning' })
    }
  } catch (err) {
    participants.value = []
    fileName.value = ''
    toast.add({ title: 'تعذرت قراءة الملف', description: (err as Error).message, color: 'error' })
  } finally {
    loading.value = false
  }
}

const canStart = computed(() => name.value.trim() && participants.value.length > 0)

function start() {
  if (!canStart.value) return
  if (program.value && !confirmReplace.value) {
    confirmReplace.value = true
    return
  }
  createProgram({
    name: name.value.trim(),
    days: days.value,
    sessionsPerDay: sessionsPerDay.value,
    participants: participants.value
  })
  confirmReplace.value = false
  navigateTo('/attendance')
}
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- ترويسة ترحيبية -->
    <section class="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 p-6 text-white shadow-lg sm:p-10">
      <div class="pointer-events-none absolute -start-16 -top-16 size-56 rounded-full bg-white/10" />
      <div class="pointer-events-none absolute -bottom-20 end-10 size-48 rounded-full bg-white/10" />
      <div class="relative flex items-center gap-4 sm:gap-6">
        <img
          src="/img/logo.png"
          alt=""
          class="size-16 shrink-0 rounded-2xl bg-white/95 p-2 shadow-md sm:size-24"
        >
        <div>
          <h2 class="text-2xl font-bold sm:text-4xl">
            نظام التحضير
          </h2>
          <p class="mt-1 text-sm text-white/85 sm:text-base">
            حضّر المشاركين لكل جلسة، واحصل على تقرير الاستحقاق وقائمة الشهادات بضغطة واحدة.
          </p>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- النموذج -->
      <form
        class="space-y-4 lg:col-span-2"
        @submit.prevent="start"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <!-- اسم البرنامج -->
          <UCard
            class="h-full"
            :ui="{ body: 'p-4 sm:p-4' }"
          >
            <div class="mb-3 flex items-center gap-2">
              <UIcon
                name="i-lucide-graduation-cap"
                class="size-5 text-primary"
              />
              <h3 class="font-bold">
                اسم البرنامج
              </h3>
            </div>
            <UFormField required>
              <UInput
                v-model="name"
                placeholder="مثال: دورة مهارات التدريس"
                size="lg"
                class="w-full"
              />
            </UFormField>
          </UCard>

          <!-- المدة -->
          <UCard
            class="h-full"
            :ui="{ body: 'p-4 sm:p-4' }"
          >
            <div class="mb-3 flex items-center gap-2">
              <UIcon
                name="i-lucide-calendar-days"
                class="size-5 text-primary"
              />
              <h3 class="font-bold">
                مدة البرنامج (أيام)
              </h3>
            </div>
            <div
              class="grid grid-cols-5 gap-2"
              role="radiogroup"
              aria-label="عدد أيام البرنامج"
            >
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                role="radio"
                :aria-checked="days === n"
                class="h-11 rounded-xl border-2 text-lg font-bold transition active:scale-95"
                :class="days === n ? 'border-primary bg-primary text-white shadow' : 'border-default hover:border-primary/60'"
                @click="days = n"
              >
                {{ n }}
              </button>
            </div>
          </UCard>

          <!-- الجلسات -->
          <UCard
            class="h-full"
            :ui="{ body: 'p-4 sm:p-4' }"
          >
            <div class="mb-3 flex items-center gap-2">
              <UIcon
                name="i-lucide-layers"
                class="size-5 text-primary"
              />
              <h3 class="font-bold">
                الجلسات اليومية
              </h3>
            </div>
            <div
              class="grid grid-cols-3 gap-2"
              role="radiogroup"
              aria-label="عدد الجلسات اليومية"
            >
              <button
                v-for="n in 3"
                :key="n"
                type="button"
                role="radio"
                :aria-checked="sessionsPerDay === n"
                class="h-11 rounded-xl border-2 text-lg font-bold transition active:scale-95"
                :class="sessionsPerDay === n ? 'border-primary bg-primary text-white shadow' : 'border-default hover:border-primary/60'"
                @click="sessionsPerDay = n"
              >
                {{ n }}
              </button>
            </div>
          </UCard>

          <!-- رفع المشاركين -->
          <UCard
            class="h-full"
            :ui="{ body: 'p-4 sm:p-4' }"
          >
            <div class="mb-3 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-users"
                  class="size-5 text-primary"
                />
                <h3 class="font-bold">
                  المشاركون
                </h3>
              </div>
              <UButton
                label="نموذج Excel"
                icon="i-lucide-download"
                variant="link"
                size="xs"
                @click="downloadTemplate"
              />
              <UButton
                label="إضافة يدوي"
                icon="i-lucide-user-plus"
                variant="link"
                size="xs"
                @click="showAddParticipant = true"
              />
            </div>
            <label
              class="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-3 transition hover:border-primary hover:bg-primary/5"
              :class="participants.length ? 'border-success bg-success/5' : 'border-accented'"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-full"
                :class="participants.length ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'"
              >
                <UIcon
                  :name="loading ? 'i-lucide-loader-circle' : participants.length ? 'i-lucide-file-check-2' : 'i-lucide-file-spreadsheet'"
                  class="size-5"
                  :class="{ 'animate-spin': loading }"
                />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-semibold">{{ fileName || 'اختر ملف Excel' }}</span>
                <span class="block text-xs text-muted">
                  {{ participants.length ? `${participants.length} مشارك · اضغط للتغيير` : 'الاسم · رقم الهوية · الجهة' }}
                </span>
              </span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                class="hidden"
                @change="onExcel"
              >
            </label>
          </UCard>
        </div>

        <UButton
          type="submit"
          label="بدء التحضير"
          icon="i-lucide-play"
          size="xl"
          block
          :disabled="!canStart"
          class="h-14 text-lg"
        />
      </form>

      <!-- الجانب -->
      <aside>
        <UCard
          class="h-full"
          :ui="{ root: 'h-full', body: 'flex h-full flex-col' }"
        >
          <h3 class="mb-3 font-bold">
            ملخص البرنامج
          </h3>
          <dl class="space-y-3 text-sm">
            <div class="flex items-center justify-between gap-2">
              <dt class="text-muted">
                الاسم
              </dt>
              <dd class="truncate font-semibold">
                {{ name || '—' }}
              </dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-muted">
                الأيام
              </dt><dd class="font-semibold">
                {{ days }}
              </dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-muted">
                الجلسات يومياً
              </dt><dd class="font-semibold">
                {{ sessionsPerDay }}
              </dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-muted">
                إجمالي الجلسات
              </dt><dd class="font-bold text-primary">
                {{ days * sessionsPerDay }}
              </dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-muted">
                المشاركون
              </dt><dd class="font-semibold">
                {{ participants.length }}
              </dd>
            </div>
          </dl>
          <div class="mt-auto pt-5">
            <p class="rounded-lg bg-primary/10 p-3 text-xs text-primary">
              يستحق المشارك الشهادة عند حضور ٪{{ PASS_PERCENT }} أو أكثر من إجمالي الجلسات.
            </p>
          </div>
        </UCard>
      </aside>
    </div>

    <UModal
      v-model:open="confirmReplace"
      title="استبدال البرنامج الحالي؟"
      description="يوجد برنامج محفوظ حالياً. إنشاء برنامج جديد سيحذف بياناته وحضوره."
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            label="إلغاء"
            color="neutral"
            variant="outline"
            @click="confirmReplace = false"
          />
          <UButton
            label="استبدال وبدء"
            color="error"
            @click="start"
          />
        </div>

        <UModal
          v-model:open="showAddParticipant"
          title="إضافة مشارك يدوياً"
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
      </template>
    </UModal>
  </div>
</template>
