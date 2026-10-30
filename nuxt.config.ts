export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vite-pwa/nuxt'],
  ssr: false,
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      title: 'نظام التحضير',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'description', content: 'تطبيق تحضير المشاركين وإصدار تقرير استحقاق الشهادات' },

        // دعم الألوان المتغيرة مع النظام (System Preference) للـ Browser Header
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#09090b', media: '(prefers-color-scheme: dark)' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/img/logo.png' },
        { rel: 'apple-touch-icon', href: '/icon-192.png' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',

  eslint: {
    config: {
      stylistic: { commaDangle: 'never', braceStyle: '1tbs' }
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
      start_url: '/?v=2',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      // صفحتا 200/404 تُرجعان خطأ 404 على Vercel، وفشل ملف واحد يُلغي تثبيت Service Worker كله
      globIgnores: ['**/200.html', '**/404.html'],
      // تحديث فوري: لا تبقى نسخة قديمة تشير إلى ملفات JS محذوفة بعد نشر جديد
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true
    },
    client: { installPrompt: true },
    devOptions: { enabled: false }
  }
})
