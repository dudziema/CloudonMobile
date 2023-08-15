import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createContext } from '@/composables/context'
import i18n from './i18n'

(() => {
  const app = createApp(App).use(i18n)
  const { injectionKey, context } = createContext()

  app.provide(injectionKey, context)

  app.use(router)
  app.mount('#app')
})()

