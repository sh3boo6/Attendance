export interface Participant {
  id: string
  name: string
  nationalId: string
  org: string
}

export interface Program {
  name: string
  days: number
  sessionsPerDay: number
  participants: Participant[]
  /** مفتاح الجلسة "يوم-جلسة" ← (معرّف المشارك ← حاضر؟) */
  attendance: Record<string, Record<string, boolean>>
  /** مفاتيح الجلسات التي ضُغط عليها "حفظ الجلسة" */
  savedSessions: string[]
  createdAt: string
}

export interface ReportRow {
  participant: Participant
  attended: number
  total: number
  percent: number
  eligible: boolean
}
