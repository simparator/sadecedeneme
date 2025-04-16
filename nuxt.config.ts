// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Terminal Delta Green', // default fallback title
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/scripts', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss : {
          additionalData: '@use "~/assets/scss/_variables.scss" as *;'
        }
      }
    },
  },
  ssr: true, // Obligatoire
  nitro: {
    preset: 'vercel', // pour que Vercel gère bien les API server
    prerender: {
      routes: ['/'] // ici tu peux mettre toutes les routes que tu veux "pré-générer"
    }
  },
  runtimeConfig: {
    openaiSecret: process.env.MISTRAL_SECRET, // server side only
    agentId: process.env.NUXT_AGENT_ID, // server side only
  },
  components: [
    {
      global: true,
      path: '~/components',
      pathPrefix: false,
    },
  ],
})
