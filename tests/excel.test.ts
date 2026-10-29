import { describe, expect, it } from 'vitest'
import * as XLSX from 'xlsx'
import { parseParticipants } from '../app/utils/excel'

function fileFrom(rows: unknown[][]) {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'Sheet1')
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
  return new File([buf], 'participants.xlsx')
}

describe('parseParticipants', () => {
  it('reads the three expected columns by header', async () => {
    const list = await parseParticipants(fileFrom([
      ['الاسم', 'رقم الهوية', 'المدرسة أو جهة العمل'],
      ['محمد أحمد', '1234567890', 'مدرسة النموذج'],
      ['سارة علي', '9876543210', 'مدرسة الأمل']
    ]))
    expect(list).toEqual([
      { id: 'p1', name: 'محمد أحمد', nationalId: '1234567890', org: 'مدرسة النموذج' },
      { id: 'p2', name: 'سارة علي', nationalId: '9876543210', org: 'مدرسة الأمل' }
    ])
  })

  it('matches headers regardless of column order', async () => {
    const list = await parseParticipants(fileFrom([
      ['جهة العمل', 'الاسم', 'الهوية'],
      ['وزارة', 'خالد', '111']
    ]))
    expect(list[0]).toMatchObject({ name: 'خالد', nationalId: '111', org: 'وزارة' })
  })

  it('skips rows without a name', async () => {
    const list = await parseParticipants(fileFrom([
      ['الاسم', 'رقم الهوية', 'الجهة'],
      ['', '1', 'x'],
      ['علي', '2', 'y']
    ]))
    expect(list).toHaveLength(1)
    expect(list[0]!.name).toBe('علي')
  })
})
