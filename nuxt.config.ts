// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    preference: 'system',
    classSuffix: ''
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  runtimeConfig: {
    public: {
      apiBase: "",
      ws: ""
    }
  },
  devServer: {
    host: "localho.st"
  }
})
