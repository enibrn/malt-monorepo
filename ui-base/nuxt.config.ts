export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-04-18",
  runtimeConfig: {
    public: {
      endpoint: process.env.NUXT_ENDPOINT,
      projectId: process.env.NUXT_PROJECT_ID,
    },
  },
})