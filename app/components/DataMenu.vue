<script setup lang="ts">
const { exportJson, importJson, reset } = useAttendance()
const toast = useToast()
const fileInput = ref<HTMLInputElement>()
const confirmReset = ref(false)
const confirmNew = ref(false)

const { program } = useAttendance()

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

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    await importJson(file)
    toast.add({ title: 'تم استرجاع الجلسة بنجاح', color: 'success', icon: 'i-lucide-check' })
    navigateTo('/attendance')
  } catch (err) {
    toast.add({ title: 'تعذر الاستيراد', description: (err as Error).message, color: 'error' })
  }
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
    description="سيتم حذف البرنامج وكل بيانات الحضور نهائياً. يُنصح بحفظ ملف نسخة احتياطية أولاً من قائمة «ملف» ← «حفظ»."
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
          label="نعم، احذف كل شيء"
          color="error"
          @click="doReset"
        />
      </div>
    </template>
  </UModal>

  <UModal
    v-model:open="confirmNew"
    title="بدء برنامج جديد"
    description="سيتم حذف بيانات البرنامج الحالي وكل بيانات الحضور نهائياً. يُنصح بحفظ ملف نسخة احتياطية أولاً من قائمة «ملف» ← «حفظ»."
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
          label="نعم، احذف وابدأ برنامجاً جديداً"
          color="error"
          @click="doReset"
        />
      </div>
    </template>
  </UModal>
</template>
