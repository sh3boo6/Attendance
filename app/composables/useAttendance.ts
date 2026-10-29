import type { Participant, Program, ReportRow } from '~/types'

export const STORAGE_KEY = 'attendance:program:v1'
export const PASS_PERCENT = 80

const DAY_NAMES = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس']
const SESSION_NAMES = ['الأولى', 'الثانية', 'الثالثة']

export const dayLabel = (day: number) => `اليوم ${DAY_NAMES[day - 1]}`
export const sessionLabel = (session: number) => `الجلسة ${SESSION_NAMES[session - 1]}`
export const sessionKey = (day: number, session: number) => `${day}-${session}`

export function isValidProgram(data: unknown): data is Program {
  const p = data as Program
  return !!p
    && typeof p.name === 'string'
    && Number.isInteger(p.days) && p.days >= 1 && p.days <= 5
    && Number.isInteger(p.sessionsPerDay) && p.sessionsPerDay >= 1 && p.sessionsPerDay <= 3
    && Array.isArray(p.participants)
    && p.participants.every(x => x && typeof x.id === 'string' && typeof x.name === 'string')
    && typeof p.attendance === 'object' && p.attendance !== null
}

export function useAttendance() {
  const program = useState<Program | null>('program', () => null)

  const totalSessions = computed(() =>
    program.value ? program.value.days * program.value.sessionsPerDay : 0)

  function createProgram(input: { name: string, days: number, sessionsPerDay: number, participants: Participant[] }) {
    program.value = {
      ...input,
      attendance: {},
      savedSessions: [],
      createdAt: new Date().toISOString()
    }
  }

  function isPresent(day: number, session: number, id: string) {
    return program.value?.attendance[sessionKey(day, session)]?.[id] === true
  }

  function setPresent(day: number, session: number, id: string, present: boolean) {
    if (!program.value) return
    const key = sessionKey(day, session)
    const sheet = program.value.attendance[key] ??= {}
    sheet[id] = present
    // أي تعديل يُلغي علامة "تم الحفظ" حتى يُحفظ مجدداً
    program.value.savedSessions = program.value.savedSessions.filter(k => k !== key)
  }

  function setAll(day: number, session: number, ids: string[], present: boolean) {
    ids.forEach(id => setPresent(day, session, id, present))
  }

  function markSaved(day: number, session: number) {
    if (!program.value) return
    const key = sessionKey(day, session)
    if (!program.value.savedSessions.includes(key)) program.value.savedSessions.push(key)
  }

  const isSaved = (day: number, session: number) =>
    !!program.value?.savedSessions.includes(sessionKey(day, session))

  function presentCount(day: number, session: number) {
    const sheet = program.value?.attendance[sessionKey(day, session)] ?? {}
    return Object.values(sheet).filter(Boolean).length
  }

  const report = computed<ReportRow[]>(() => {
    const p = program.value
    if (!p) return []
    const total = totalSessions.value
    return p.participants.map((participant) => {
      let attended = 0
      for (let d = 1; d <= p.days; d++) {
        for (let s = 1; s <= p.sessionsPerDay; s++) {
          if (p.attendance[sessionKey(d, s)]?.[participant.id]) attended++
        }
      }
      const percent = total ? (attended / total) * 100 : 0
      return { participant, attended, total, percent, eligible: percent >= PASS_PERCENT }
    })
  })

  const exportJson = () => {
    if (!program.value) return
    const blob = new Blob([JSON.stringify(program.value, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `${program.value.name || 'attendance'}.json`)
  }

  async function importJson(file: File) {
    const data = JSON.parse(await file.text())
    if (!isValidProgram(data)) throw new Error('الملف غير صالح، اختر ملفاً محفوظاً من التطبيق')
    data.savedSessions = Array.isArray(data.savedSessions) ? data.savedSessions : []
    program.value = data
  }

  function reset() {
    program.value = null
    safeStorage.remove(STORAGE_KEY)
  }

  return {
    program, totalSessions, report,
    createProgram, isPresent, setPresent, setAll, markSaved, isSaved, presentCount,
    exportJson, importJson, reset
  }
}
