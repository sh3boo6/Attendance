// iOS لا يحدّث شريط الحالة (الإشارة والواي فاي) عند تبديل المظهر داخل التطبيق إلا بعد أول تفاعل،
// فنحدّث theme-color حسب مظهر التطبيق (لا مظهر الجهاز) ونُجبر المتصفح على إعادة الرسم فوراً.
export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  async function apply(nudge = true) {
    // ننتظر تطبيق صنف .dark على الصفحة ثم نقرأ لون الخلفية الفعلي، فيطابق الشريط والطبقة الصفحة تماماً
    await nextTick()
    const color = getComputedStyle(document.body).backgroundColor

    // نُبقي وسماً واحداً بدون media حتى لا يغلب مظهر الجهاز مظهر التطبيق
    const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')]
    const meta = metas[0] ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }))
    metas.slice(1).forEach(m => m.remove())
    meta.removeAttribute('media')
    meta.setAttribute('content', color)

    if (!nudge) return

    // فتح أي قائمة أو نافذة يجعل iOS يعيد قراءة لون الشريط، فنحاكي ذلك: طبقة بلون الخلفية
    // الجديدة تغطي الشاشة لحظة قصيرة مع قفل التمرير، ثم تُزال. لونها مطابق للخلفية فلا يظهر فرق.
    const overlay = document.createElement('div')
    overlay.setAttribute('aria-hidden', 'true')
    overlay.style.cssText = `position:fixed;inset:0;z-index:2147483647;pointer-events:none;background:${color}`
    document.body.appendChild(overlay)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setTimeout(() => {
      overlay.remove()
      document.body.style.overflow = prevOverflow
    }, 80)
  }

  // أول تحميل: نضبط الوسم فقط بلا طبقة
  watch(() => colorMode.value, (_, old) => apply(old !== undefined), { immediate: true })
})
