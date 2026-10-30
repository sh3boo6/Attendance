export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()
  const mq = window.matchMedia('(prefers-color-scheme: dark)')

  const sync = () => {
    if (colorMode.preference === 'system' && !colorMode.forced) {
      colorMode.value = mq.matches ? 'dark' : 'light'
    }
  }
  mq.addEventListener('change', sync)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sync()
  })
  window.addEventListener('focus', sync)
  window.addEventListener('pageshow', sync)
})
