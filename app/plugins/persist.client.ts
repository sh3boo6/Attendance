import { STORAGE_KEY, isValidProgram } from '~/composables/useAttendance'
import type { Program } from '~/types'

// تحميل البيانات من LocalStorage ثم حفظ تلقائي عند أي تغيير
export default defineNuxtPlugin(() => {
  const program = useState<Program | null>('program', () => null)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (isValidProgram(data)) program.value = data
    }
  } catch {}

  watch(program, (value) => {
    try {
      if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {}
  }, { deep: true })
})
