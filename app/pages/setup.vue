<script setup lang="ts">
import type { Participant } from '~/types'

const { program, createProgram, importJson } = useAttendance()
const toast = useToast()

const name = ref('')
const days = ref(1)
const sessionsPerDay = ref(1)
const participants = ref<Participant[]>([])
const fileName = ref('')
const loading = ref(false)
const confirmReplace = ref(false)
const jsonInput = ref<HTMLInputElement>()

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

async function onJson(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    await importJson(file)
    toast.add({ title: 'تم استرجاع الجلسة', color: 'success' })
    navigateTo('/attendance')
  } catch (err) {
    toast.add({ title: 'تعذر الاستيراد', description: (err as Error).message, color: 'error' })
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
        <img src="/img/logo.png" alt="" class="size-16 shrink-0 rounded-2xl bg-white/95 p-2 shadow-md sm:size-24">
        <div>
          <h2 class="text-2xl font-bold sm:text-4xl">نظام التحضير</h2>
          <p class="mt-1 text-sm text-white/85 sm:text-base">
            حضّر المشاركين لكل جلسة، واحصل على تقرير الاستحقاق وقائمة الشهادات بضغطة واحدة.
          </p>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- النموذج -->
      <form class="space-y-5 lg:col-span-2" @submit.prevent="start">
        <!-- 1 -->
        <UCard>
          <div class="mb-4 flex items-center gap-3">
            <span class="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
            <h3 class="font-bold">بيانات البرنامج</h3>
          </div>
          <UFormField label="اسم البرنامج التدريبي" required>
            <UInput v-model="name" icon="i-lucide-graduation-cap" placeholder="مثال: دورة مهارات التدريس الفعّال" size="xl" class="w-full" />
          </UFormField>
        </UCard>

        <!-- 2 -->
        <UCard>
          <div class="mb-4 flex items-center gap-3">
            <span class="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span>
            <h3 class="font-bold">مدة البرنامج</h3>
          </div>
          <div class="grid gap-6 sm:grid-cols-2">
            <UFormField label="عدد أيام البرنامج">
              <div class="grid grid-cols-5 gap-2" role="radiogroup">
                <button
                  v-for="n in 5" :key="n" type="button" role="radio" :aria-checked="days === n"
                  class="h-12 rounded-xl border-2 text-lg font-bold transition active:scale-95"
                  :class="days === n ? 'border-primary bg-primary text-white shadow' : 'border-default hover:border-primary/60'"
                  @click="days = n"
                >{{ n }}</button>
              </div>
            </UFormField>
            <UFormField label="عدد الجلسات اليومية">
              <div class="grid grid-cols-3 gap-2" role="radiogroup">
                <button
                  v-for="n in 3" :key="n" type="button" role="radio" :aria-checked="sessionsPerDay === n"
                  class="h-12 rounded-xl border-2 text-lg font-bold transition active:scale-95"
                  :class="sessionsPerDay === n ? 'border-primary bg-primary text-white shadow' : 'border-default hover:border-primary/60'"
                  @click="sessionsPerDay = n"
                >{{ n }}</button>
              </div>
            </UFormField>
          </div>
        </UCard>

        <!-- 3 -->
        <UCard>
          <div class="mb-4 flex items-center gap-3">
            <span class="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">3</span>
            <h3 class="font-bold">قائمة المشاركين</h3>
          </div>
          <label
            class="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition hover:border-primary hover:bg-primary/5"
            :class="participants.length ? 'border-success bg-success/5' : 'border-accented'"
          >
            <span class="flex size-14 items-center justify-center rounded-full" :class="participants.length ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'">
              <UIcon
                :name="loading ? 'i-lucide-loader-circle' : participants.length ? 'i-lucide-file-check-2' : 'i-lucide-file-spreadsheet'"
                class="size-7" :class="{ 'animate-spin': loading }"
              />
            </span>
            <span class="font-semibold">{{ fileName || 'اضغط لاختيار ملف Excel' }}</span>
            <span class="text-xs text-muted">
              {{ participants.length ? `تم تحميل ${participants.length} مشارك · اضغط لتغيير الملف` : 'xlsx / xls / csv' }}
            </span>
            <input type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onExcel">
          </label>
          <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
            <span>الأعمدة: <b>الاسم</b> · <b>رقم الهوية</b> · <b>المدرسة أو جهة العمل</b></span>
            <UButton label="تنزيل نموذج Excel" icon="i-lucide-download" variant="link" size="xs" @click="downloadTemplate" />
          </div>
        </UCard>

        <UButton type="submit" label="بدء التحضير" icon="i-lucide-play" size="xl" block :disabled="!canStart" class="h-14 text-lg" />
      </form>

      <!-- الجانب -->
      <aside class="space-y-5 lg:sticky lg:top-20 lg:self-start">
        <UCard>
          <h3 class="mb-3 font-bold">ملخص البرنامج</h3>
          <dl class="space-y-3 text-sm">
            <div class="flex items-center justify-between gap-2">
              <dt class="text-muted">الاسم</dt>
              <dd class="truncate font-semibold">{{ name || '—' }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-muted">الأيام</dt><dd class="font-semibold">{{ days }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-muted">الجلسات يومياً</dt><dd class="font-semibold">{{ sessionsPerDay }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-muted">إجمالي الجلسات</dt><dd class="font-bold text-primary">{{ days * sessionsPerDay }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-muted">المشاركون</dt><dd class="font-semibold">{{ participants.length }}</dd>
            </div>
          </dl>
          <p class="mt-4 rounded-lg bg-primary/10 p-3 text-xs text-primary">
            يستحق المشارك الشهادة عند حضور ٪{{ PASS_PERCENT }} أو أكثر من إجمالي الجلسات.
          </p>
        </UCard>

        <UCard>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-history" class="mt-0.5 size-5 shrink-0 text-primary" />
            <div class="min-w-0 flex-1">
              <p class="font-semibold">لديك نسخة سابقة؟</p>
              <p class="mb-3 text-sm text-muted">استعد جلسة عمل سابقة من ملف JSON.</p>
              <UButton label="استيراد ملف JSON" icon="i-lucide-upload" color="neutral" variant="outline" size="sm" @click="jsonInput?.click()" />
              <input ref="jsonInput" type="file" accept="application/json,.json" class="hidden" @change="onJson">
            </div>
          </div>
        </UCard>
      </aside>
    </div>

    <UModal v-model:open="confirmReplace" title="استبدال البرنامج الحالي؟" description="يوجد برنامج محفوظ حالياً. إنشاء برنامج جديد سيحذف بياناته وحضوره.">
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="إلغاء" color="neutral" variant="outline" @click="confirmReplace = false" />
          <UButton label="استبدال وبدء" color="error" @click="start" />
        </div>
      </template>
    </UModal>
  </div>
</template>
