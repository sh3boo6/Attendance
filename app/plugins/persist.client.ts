import { STORAGE_KEY } from '~/composables/useAttendance'
import type { Program } from '~/types'

// تحميل البيانات من LocalStorage ثم حفظ تلقائي عند أي تغيير
export default defineNuxtPlugin(() => {
  const program = useState<Program | null>('program', () => null)

  try {
    const raw = safeStorage.get(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : null
    if (isValidProgram(data)) program.value = data
  } catch {
    // JSON تالف: نبدأ ببيانات فارغة
  }

  watch(program, (value) => {
    if (value) safeStorage.set(STORAGE_KEY, JSON.stringify(value))
  }, { deep: true })
})
