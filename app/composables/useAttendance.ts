import type { Participant, Program, ReportRow } from '~/types'

export const STORAGE_KEY = 'attendance:program:v1'

const DAY_NAMES = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس']
const SESSION_NAMES = ['الأولى', 'الثانية', 'الثالثة']

export const dayLabel = (day: number) => `اليوم ${DAY_NAMES[day - 1]}`
export const sessionLabel = (session: number) => `الجلسة ${SESSION_NAMES[session - 1]}`

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

  /** حذف متدرب مع كل سجلات حضوره */
  function removeParticipant(id: string) {
    const p = program.value
    if (!p) return
    p.participants = p.participants.filter(x => x.id !== id)
    p.attendance = Object.fromEntries(
      Object.entries(p.attendance).map(([key, sheet]) => [
        key,
        Object.fromEntries(Object.entries(sheet).filter(([pid]) => pid !== id))
      ])
    )
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

  const report = computed<ReportRow[]>(() => program.value ? buildReport(program.value) : [])

  const exportJson = () => {
    if (!program.value) return
    const blob = new Blob([JSON.stringify(program.value, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `${program.value.name || 'attendance'}.json`)
  }

  /** يقرأ الملف ويتحقق منه فقط؛ لا يغيّر البرنامج الحالي حتى يُستدعى openProgram */
  async function readProgramFile(file: File): Promise<Program> {
    return parseProgramJson(await file.text())
  }

  function openProgram(data: Program) {
    program.value = data
  }

  function reset() {
    program.value = null
    safeStorage.remove(STORAGE_KEY)
  }

  return {
    program, totalSessions, report,
    createProgram, removeParticipant, isPresent, setPresent, setAll, markSaved, isSaved, presentCount,
    exportJson, readProgramFile, openProgram, reset
  }
}
