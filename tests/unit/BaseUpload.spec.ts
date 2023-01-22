import { mount } from '@vue/test-utils'
import BaseUpload from '@/components/ui/BaseUpload.vue'
import { createContext } from '@/composables/context'

describe('BaseUpload', () => {
  it('renders correctly', () => {
    const { context } = createContext()
    const wrapper = mount(BaseUpload, {
      global: {
        provide: {
          context: context
        }
      }
    });

    // Assertions
    expect(wrapper.element).toMatchSnapshot()
  })
})
