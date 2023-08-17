import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createContext } from '@/composables/context'
import i18n from './i18n'

(() => {
  const app = createApp(App).use(i18n)

  // Detect user's language and set the appropriate locale
  const userLanguage = navigator.language
  const isPoland = userLanguage.toLowerCase().startsWith('pl')
  i18n.global.locale.value = isPoland ? 'pl' : 'en'

  const { injectionKey, context } = createContext()

  app.provide(injectionKey, context)

  app.use(router)
  app.mount('#app')
})()

