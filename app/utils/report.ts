import type { Program, ReportRow } from '~/types'

/** الحد الأدنى لنسبة الحضور لاستحقاق الشهادة */
export const PASS_PERCENT = 80

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

/** نسبة الحضور = (عدد مرات الحضور ÷ إجمالي الجلسات) × 100 */
export function buildReport(p: Program): ReportRow[] {
  const total = p.days * p.sessionsPerDay
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
}
