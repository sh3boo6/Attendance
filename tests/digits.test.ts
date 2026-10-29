import { describe, expect, it } from 'vitest'
import { toEnglishDigits } from '../app/utils/digits'

describe('toEnglishDigits', () => {
  it('converts Arabic-Indic and Persian digits', () => {
    expect(toEnglishDigits('١٢٣٤٥٦٧٨٩٠')).toBe('1234567890')
    expect(toEnglishDigits('۱۲۳۴۵۶۷۸۹۰')).toBe('1234567890')
  })

  it('leaves other characters untouched and handles empty values', () => {
    expect(toEnglishDigits('مدرسة ٣ - A1')).toBe('مدرسة 3 - A1')
    expect(toEnglishDigits(null)).toBe('')
    expect(toEnglishDigits(undefined)).toBe('')
  })
})
