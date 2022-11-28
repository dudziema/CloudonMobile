import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createContext } from '@/composables/context'

(() => {
  const app = createApp(App)
  const { injectionKey, context } = createContext()

  app.provide(injectionKey, context)

  app.use(router)
  app.mount('#app')
})()

