import { describe, expect, it } from 'vitest'
import { PASS_PERCENT, buildReport, isValidProgram, parseProgramJson, sessionKey } from '../app/utils/report'
import type { Program } from '../app/types'

function makeProgram(days: number, sessionsPerDay: number, present: Record<string, string[]>): Program {
  const participants = ['a', 'b', 'c'].map(id => ({ id, name: `p-${id}`, nationalId: id, org: 'org' }))
  const attendance: Program['attendance'] = {}
  for (const [key, ids] of Object.entries(present)) {
    attendance[key] = Object.fromEntries(participants.map(p => [p.id, ids.includes(p.id)]))
  }
  return { name: 'test', days, sessionsPerDay, participants, attendance, savedSessions: [], createdAt: '' }
}

describe('buildReport', () => {
  it('computes percent = attended / total sessions * 100', () => {
    const p = makeProgram(1, 3, { [sessionKey(1, 1)]: ['a'], [sessionKey(1, 2)]: ['a', 'b'] })
    const rows = buildReport(p)
    expect(rows.find(r => r.participant.id === 'a')).toMatchObject({ attended: 2, total: 3 })
    expect(rows.find(r => r.participant.id === 'a')!.percent).toBeCloseTo(66.67, 1)
    expect(rows.find(r => r.participant.id === 'c')!.percent).toBe(0)
  })

  it('marks eligibility at exactly 80% and above', () => {
    const keys = ['1-1', '2-1', '3-1', '4-1', '5-1']
    // 5 جلسات: 4 حضور = 80% بالضبط
    const p = makeProgram(5, 1, Object.fromEntries(keys.map((k, i) => [k, i < 4 ? ['a', 'b'] : ['b']])))
    const rows = buildReport(p)
    expect(PASS_PERCENT).toBe(80)
    expect(rows.find(r => r.participant.id === 'a')).toMatchObject({ percent: 80, eligible: true })
    expect(rows.find(r => r.participant.id === 'b')).toMatchObject({ percent: 100, eligible: true })
    expect(rows.find(r => r.participant.id === 'c')).toMatchObject({ percent: 0, eligible: false })
  })

  it('is not eligible just under 80%', () => {
    // 4 جلسات: 3 حضور = 75%
    const p = makeProgram(2, 2, { '1-1': ['a'], '1-2': ['a'], '2-1': ['a'] })
    expect(buildReport(p).find(r => r.participant.id === 'a')).toMatchObject({ percent: 75, eligible: false })
  })

  it('treats unrecorded sessions as absent', () => {
    const p = makeProgram(2, 1, {})
    expect(buildReport(p).every(r => r.attended === 0 && !r.eligible)).toBe(true)
  })
})

describe('isValidProgram', () => {
  it('accepts a valid program', () => {
    expect(isValidProgram(makeProgram(2, 2, {}))).toBe(true)
  })

  it('rejects out-of-range or malformed data', () => {
    expect(isValidProgram(null)).toBe(false)
    expect(isValidProgram({})).toBe(false)
    expect(isValidProgram({ ...makeProgram(2, 2, {}), days: 6 })).toBe(false)
    expect(isValidProgram({ ...makeProgram(2, 2, {}), sessionsPerDay: 0 })).toBe(false)
    expect(isValidProgram({ ...makeProgram(2, 2, {}), participants: 'x' })).toBe(false)
  })
})

describe('parseProgramJson', () => {
  it('parses a saved program and defaults savedSessions', () => {
    const saved = makeProgram(2, 2, {}) as Partial<Program>
    delete saved.savedSessions
    const parsed = parseProgramJson(JSON.stringify(saved))
    expect(parsed.name).toBe('test')
    expect(parsed.savedSessions).toEqual([])
  })

  it('throws a friendly error for invalid JSON or wrong shape', () => {
    expect(() => parseProgramJson('not json')).toThrow('الملف غير صالح')
    expect(() => parseProgramJson('{"a":1}')).toThrow('الملف غير صالح')
  })
})
