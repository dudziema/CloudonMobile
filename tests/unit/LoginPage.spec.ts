import { mount, VueWrapper } from '@vue/test-utils'
import { createContext } from '@/composables/context'
import LoginPage from '@/views/LoginPage.vue'

const { context } = createContext()

describe('LoginPage', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(LoginPage, {
      global: {
        provide: {
          context: context
        }
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders all 6 imputs', () => {
    const input = wrapper.findAll('[data-testid=login-input]')
    expect(input).toHaveLength(6)
  })
})
