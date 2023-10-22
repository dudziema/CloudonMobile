import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import { createContext } from '@/composables/context'

type AvailableLanguage = 'pl' | 'en'

(() => {
  // Detect user's language and set the appropriate locale
  // .split('-')[0] is used to extract the primary language code from a language code that includes a region (e.g., 'pl-PL').
  const userLanguage = navigator.language.toLowerCase().split('-')[0] as AvailableLanguage
  i18n.global.locale.value = userLanguage || 'en'

  const app = createApp(App).use(i18n)

  const { injectionKey, context } = createContext()

  app.provide(injectionKey, context)

  app.use(router)
  app.mount('#app')
})()

