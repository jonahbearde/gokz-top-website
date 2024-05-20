export default defineNuxtConfig({
  runtimeConfig:{
    public: {
      apiBase: ''
    }
  },
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts', "nuxt-gtag"],
  fonts: {
    provider: "bunny",
    defaults: {
      weights: [400, 500, 600, 700, 800],
      styles: ["normal"],
    },
  },
  gtag: {
    id: 'G-SD145MZQDR'
  },
  ssr: false
})