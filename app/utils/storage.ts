// الوصول إلى LocalStorage قد يفشل (وضع التصفح الخاص أو منع البيانات)، فكل العمليات آمنة
export const safeStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value)
    } catch {
      // التخزين غير متاح: نتجاهل الخطأ
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key)
    } catch {
      // التخزين غير متاح: نتجاهل الخطأ
    }
  }
}
