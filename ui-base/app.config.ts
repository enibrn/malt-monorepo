export default defineAppConfig({
  baseLayer: {
    name: 'Hello from Base layer'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    baseLayer?: {
      /** Project name */
      name?: string
    }
  }
}
