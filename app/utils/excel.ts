import type { Participant, ReportRow } from '~/types'

/** تحميل مكتبة Excel عند الحاجة، مع رسالة مفهومة إن تعذّر تحميل ملفها (مثلاً بعد تحديث التطبيق) */
async function loadXlsx() {
  try {
    return await import('xlsx')
  } catch {
    throw new Error('تعذّر تحميل أداة Excel. أعد تحميل الصفحة وحاول مرة أخرى.')
  }
}

const normalize = (s: unknown) =>
  String(s ?? '').replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/\s+/g, '').trim()

function findColumn(headers: string[], patterns: string[], fallback: number) {
  const idx = headers.findIndex(h => patterns.some(p => normalize(h).includes(p)))
  return idx >= 0 ? idx : fallback
}

/** قراءة ملف Excel بأعمدة: الاسم، رقم الهوية، المدرسة أو جهة العمل */
export async function parseParticipants(file: File): Promise<Participant[]> {
  const XLSX = await loadXlsx()
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]!]
  if (!sheet) throw new Error('الملف لا يحتوي على أي ورقة')

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '', raw: false })
  const headerIdx = rows.findIndex(r => r.some(c => normalize(c).includes('اسم')))
  const start = headerIdx >= 0 ? headerIdx : 0
  const headers = (rows[start] ?? []).map(String)

  const nameCol = findColumn(headers, ['الاسم', 'اسم'], 0)
  const idCol = findColumn(headers, ['الهوية', 'هوية', 'السجل'], 1)
  const orgCol = findColumn(headers, ['المدرسة', 'جهة', 'العمل'], 2)

  return rows
    .slice(headerIdx >= 0 ? start + 1 : 0)
    .map(r => ({
      name: String(r[nameCol] ?? '').trim(),
      nationalId: String(r[idCol] ?? '').trim(),
      org: String(r[orgCol] ?? '').trim()
    }))
    .filter(r => r.name)
    .map((r, i) => ({ id: `p${i + 1}`, ...r }))
}

export async function downloadTemplate() {
  const XLSX = await loadXlsx()
  const ws = XLSX.utils.aoa_to_sheet([
    ['الاسم', 'رقم الهوية', 'المدرسة أو جهة العمل'],
    ['مثال: محمد أحمد', '1234567890', 'مدرسة النموذج']
  ])
  ws['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 32 }]
  const wb = XLSX.utils.book_new()
  wb.Workbook = { Views: [{ RTL: true }] }
  XLSX.utils.book_append_sheet(wb, ws, 'المشاركون')
  XLSX.writeFile(wb, 'نموذج-المشاركين.xlsx')
}

/** تصدير المستحقين للشهادة فقط */
export async function exportEligible(programName: string, rows: ReportRow[]) {
  const XLSX = await loadXlsx()
  const data = rows.filter(r => r.eligible).map((r, i) => ({
    'م': i + 1,
    'الاسم': r.participant.name,
    'رقم الهوية': r.participant.nationalId,
    'المدرسة أو جهة العمل': r.participant.org,
    'الجلسات المحضورة': `${r.attended} من ${r.total}`,
    'نسبة الحضور': `${Math.round(r.percent)}%`
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  ws['!cols'] = [{ wch: 5 }, { wch: 28 }, { wch: 18 }, { wch: 32 }, { wch: 18 }, { wch: 14 }]
  const wb = XLSX.utils.book_new()
  wb.Workbook = { Views: [{ RTL: true }] }
  XLSX.utils.book_append_sheet(wb, ws, 'المستحقون للشهادة')
  XLSX.writeFile(wb, `المستحقون للشهادة - ${programName}.xlsx`)
  return data.length
}
