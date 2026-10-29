const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩'
const EXTENDED_ARABIC_INDIC = '۰۱۲۳۴۵۶۷۸۹'

/** تحويل الأرقام العربية (٠-٩) والفارسية (۰-۹) إلى أرقام إنجليزية (0-9) */
export function toEnglishDigits(value: unknown): string {
  return String(value ?? '').replace(/[٠-٩۰-۹]/g, (d) => {
    const i = ARABIC_INDIC.indexOf(d)
    return String(i >= 0 ? i : EXTENDED_ARABIC_INDIC.indexOf(d))
  })
}
