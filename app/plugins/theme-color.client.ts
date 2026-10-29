export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()
  const mq = window.matchMedia('(prefers-color-scheme: dark)')

  // متابعة وضع الجهاز مباشرة. بعض متصفحات الجوال/PWA لا تُطلق حدث change
  // والتطبيق في الخلفية، فنعيد المزامنة أيضاً عند العودة إليه.
  const sync = () => {
    if (colorMode.preference === 'system' && !colorMode.forced) {
      colorMode.value = mq.matches ? 'dark' : 'light'
    }
  }
  mq.addEventListener('change', sync)
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync() })
  window.addEventListener('focus', sync)
  window.addEventListener('pageshow', sync)

  // vite-pwa يحقن meta theme-color ثابتة من الـ manifest، فنحدّث كل النسخ يدوياً
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
