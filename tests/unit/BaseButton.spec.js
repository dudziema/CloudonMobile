import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton'
// import { describe, it } from 'node:test'

describe('BaseButton', () => {
  it(`renders the button successfully`, () => {
    const theme = {
      theme: 'active'
    }
  })

  const wrapper = mount(BaseButton, { props: { theme }})
})