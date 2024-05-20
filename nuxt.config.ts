// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig:{
    public: {
      apiBase: ''
    }
  },
  devtools: { enabled: false },
  modules: [ '@nuxtjs/tailwindcss', '@nuxt/fonts'],
  fonts: {
    provider: "bunny",
    defaults: {
      weights: [400, 500, 600, 700, 800],
      styles: ["normal"],
    },
  },
  ssr: false
})
