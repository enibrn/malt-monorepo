export default defineNuxtRouteMiddleware((to, from) => {
  // Redirect to login page if user is not authenticated
  const { user } = useAuth();
  if (!user) {
    return navigateTo('/login');
  }
});