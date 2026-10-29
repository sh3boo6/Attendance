export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: false },

  modules: ['@nuxt/ui', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      title: 'نظام التحضير',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        
        { name: 'description', content: 'تطبيق تحضير المشاركين وإصدار تقرير استحقاق الشهادات' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/img/logo.png' },
        { rel: 'apple-touch-icon', href: '/icon-192.png' }
      ]
    }
  },

  fonts: {
    families: [{ name: 'IBM Plex Sans Arabic', provider: 'google', weights: [400, 500, 600, 700] }]
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'نظام التحضير',
      short_name: 'نظام التحضير',
      description: 'تحضير المشاركين وإصدار تقرير استحقاق الشهادات',
      lang: 'ar',
      dir: 'rtl',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}']
    },
    client: { installPrompt: true },
    devOptions: { enabled: true, type: "module" }
  }
})
