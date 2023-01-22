import { inject } from 'vue'
import { Context } from '@/classes/Context'

const injectionKey = 'context'

export function createContext(initialState = {}) {
  const context = new Context(initialState)

  return { injectionKey, context }
}

export function useContext() {
  const context = inject(injectionKey)
  if (!context) throw Error('fatal error: Context not provided!')

  return context
}
