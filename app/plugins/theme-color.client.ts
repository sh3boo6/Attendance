export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  const sync = () => {
    const bg = getComputedStyle(document.body).backgroundColor
    let meta = document.querySelector('meta[name="theme-color"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', bg)
  }

  watch(() => colorMode.value, sync, { immediate: true })
  if (import.meta.client) sync()
})
