// iOS لا يحدّث شريط الحالة (الإشارة والواي فاي) عند تبديل المظهر داخل التطبيق إلا بعد أول تفاعل،
// فنحدّث theme-color حسب مظهر التطبيق (لا مظهر الجهاز) ونُجبر المتصفح على إعادة الرسم فوراً.
const COLORS = { light: '#ffffff', dark: '#09090b' } as const

export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  function apply(mode: string) {
    const color = mode === 'dark' ? COLORS.dark : COLORS.light

    // نُبقي وسماً واحداً بدون media حتى لا يغلب مظهر الجهاز مظهر التطبيق
    const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')]
    const meta = metas[0] ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }))
    metas.slice(1).forEach(m => m.remove())
    meta.removeAttribute('media')
    meta.setAttribute('content', color)

    // إعادة رسم إجبارية
    const root = document.documentElement
    root.style.transform = 'translateZ(0)'
    void root.offsetHeight
    requestAnimationFrame(() => {
      root.style.transform = ''
      window.scrollBy(0, 1)
      window.scrollBy(0, -1)
    })
  }

  watch(() => colorMode.value, mode => apply(mode), { immediate: true })
})
