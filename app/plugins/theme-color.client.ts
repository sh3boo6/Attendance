// vite-pwa يحقن meta theme-color ثابتة من الـ manifest، فنحدّث كل النسخ يدوياً عند تغيّر الوضع
export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()
  watch(() => colorMode.value, (mode) => {
    const color = mode === 'dark' ? '#0f172b' : '#ffffff'
    let metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    if (!metas.length) {
      const m = document.createElement('meta')
      m.name = 'theme-color'
      document.head.appendChild(m)
      metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    }
    metas.forEach(m => m.setAttribute('content', color))
  }, { immediate: true })
})
