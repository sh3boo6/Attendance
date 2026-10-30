<script setup lang="ts">
import type { Program } from '~/types'

const { program, exportJson, readProgramFile, openProgram, reset } = useAttendance()
const toast = useToast()
const fileInput = ref<HTMLInputElement>()
const confirmReset = ref(false)
const confirmNew = ref(false)
// برنامج قُرئ من ملف وينتظر قرار المستخدم قبل استبدال الحالي
const pending = ref<Program | null>(null)
const confirmOpen = computed({
  get: () => !!pending.value,
  set: (v: boolean) => {
    if (!v) pending.value = null
  }
})

const items = computed(() => {
  const open = { label: 'فتح', icon: 'i-lucide-file', onSelect: () => fileInput.value?.click() }
  // قبل وجود برنامج لا يوجد ما يُحفظ أو يُحذف
  if (!program.value) return [[open]]
  return [[
    { label: 'حفظ', icon: 'i-lucide-save', onSelect: exportJson },
    open
  ], [
    { label: 'برنامج جديد', icon: 'i-lucide-plus', onSelect: () => { confirmNew.value = true } },
    { label: 'إعادة ضبط البيانات', icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => { confirmReset.value = true } }
  ]]
})

function finishOpen() {
  if (!pending.value) return
  openProgram(pending.value)
  pending.value = null
  toast.add({ title: 'تم فتح البرنامج بنجاح', color: 'success', icon: 'i-lucide-check' })
  navigateTo('/attendance')
}

function saveThenOpen() {
  exportJson()
  finishOpen()
}

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    pending.value = await readProgramFile(file)
    // لا يوجد برنامج حالي يُستبدل: نفتح مباشرة
    if (!program.value) finishOpen()
  } catch (err) {
    toast.add({ title: 'تعذر فتح الملف', description: (err as Error).message, color: 'error' })
  }
}

function saveThenReset() {
  exportJson()
  doReset()
}

function doReset() {
  reset()
  confirmReset.value = false
  confirmNew.value = false
  toast.add({ title: 'تمت إعادة ضبط البيانات', color: 'neutral' })
  navigateTo('/setup')
}
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end' }"
  >
    <UButton
      icon="i-lucide-folder"
      label="ملف"
      color="neutral"
      variant="ghost"
      aria-label="إدارة البيانات"
    />
  </UDropdownMenu>
  <input
    ref="fileInput"
    type="file"
    accept="application/json,.json"
    class="hidden"
    @change="onFile"
  >

  <UModal
    v-model:open="confirmReset"
    title="إعادة ضبط البيانات"
    description="سيتم حذف البرنامج وكل بيانات الحضور نهائياً. هل تريد حفظ نسخة منه أولاً؟"
  >
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          label="إلغاء"
          color="neutral"
          variant="outline"
          @click="confirmReset = false"
        />
        <UButton
          label="حفظ ثم حذف"
          icon="i-lucide-save"
          @click="saveThenReset"
        />
        <UButton
          label="حذف بدون حفظ"
          color="error"
          variant="outline"
          @click="doReset"
        />
      </div>
    </template>
  </UModal>

  <UModal
    v-model:open="confirmNew"
    title="بدء برنامج جديد"
    description="سيتم حذف بيانات البرنامج الحالي وكل بيانات الحضور نهائياً. هل تريد حفظ نسخة منه أولاً؟"
  >
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          label="إلغاء"
          color="neutral"
          variant="outline"
          @click="confirmNew = false"
        />
        <UButton
          label="حفظ ثم برنامج جديد"
          icon="i-lucide-save"
          @click="saveThenReset"
        />
        <UButton
          label="بدون حفظ"
          color="error"
          variant="outline"
          @click="doReset"
        />
      </div>
    </template>
  </UModal>

  <UModal
    v-model:open="confirmOpen"
    title="استبدال البرنامج الحالي؟"
    :description="`سيتم استبدال «${program?.name ?? ''}» بالبرنامج «${pending?.name ?? ''}». هل تريد حفظ نسخة من الحالي أولاً؟`"
  >
    <template #footer>
      <div class="flex w-full flex-wrap justify-end gap-2">
        <UButton
          label="إلغاء"
          color="neutral"
          variant="outline"
          @click="pending = null"
        />
        <UButton
          label="فتح بدون حفظ"
          color="error"
          variant="outline"
          @click="finishOpen"
        />
        <UButton
          label="حفظ ثم فتح"
          icon="i-lucide-save"
          @click="saveThenOpen"
        />
      </div>
    </template>
  </UModal>
</template>
