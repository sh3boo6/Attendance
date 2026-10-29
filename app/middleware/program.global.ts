export default defineNuxtRouteMiddleware((to) => {
  const { program } = useAttendance()
  if (to.path === '/') return navigateTo(program.value ? '/attendance' : '/setup', { replace: true })
  if (to.path !== '/setup' && !program.value) return navigateTo('/setup', { replace: true })
})
