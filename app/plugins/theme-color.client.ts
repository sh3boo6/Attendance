export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  const sync = () => {
    const isDark = colorMode.value === 'dark'
    const bg = getComputedStyle(document.body).backgroundColor

    let themeMeta = document.querySelector('meta[name="theme-color"]')
    if (!themeMeta) {
      themeMeta = document.createElement('meta')
      themeMeta.setAttribute('name', 'theme-color')
      document.head.appendChild(themeMeta)
    }
    themeMeta.setAttribute('content', bg)

    let statusMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (!statusMeta) {
      statusMeta = document.createElement('meta')
      statusMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
      document.head.appendChild(statusMeta)
    }
    statusMeta.setAttribute('content', isDark ? 'black' : 'default')
  }

  watch(() => colorMode.value, sync, { immediate: true })
})
