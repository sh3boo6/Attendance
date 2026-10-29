// iOS Safari يتجاهل user-scalable=no، فنمنع إيماءة القرص (pinch) يدوياً
export default defineNuxtPlugin(() => {
  const stop = (e: Event) => e.preventDefault()
  document.addEventListener('gesturestart', stop)
  document.addEventListener('gesturechange', stop)
  document.addEventListener('touchmove', (e) => {
    if ((e as TouchEvent).touches.length > 1) e.preventDefault()
  }, { passive: false })
})
