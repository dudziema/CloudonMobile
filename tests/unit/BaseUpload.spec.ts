import { mount } from '@vue/test-utils'
import BaseUpload from '@/components/ui/BaseUpload.vue'
import { createContext } from '@/composables/context'

const { context } = createContext()

describe('BaseUpload', () => {
  it('renders correctly', () => {
    const wrapper = mount(BaseUpload, {
      global: {
        provide: {
          context: context
        }
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
