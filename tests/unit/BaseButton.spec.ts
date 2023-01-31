import { shallowMount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'
import Theme from '@/types/Theme'

describe('BaseButton', () => {
  it('renders with active theme when passed as prop', () => {
    const theme = Theme.ACTIVE
    const wrapper = shallowMount(BaseButton, { props: { theme }})
    expect(wrapper.attributes('class')).toBe('base-button base-button--active')
  })

  it('renders with inactive theme when passed as prop', () => {
    const theme = Theme.INACTIVE
    const wrapper = shallowMount(BaseButton, { props: { theme }})
    expect(wrapper.attributes('class')).toBe('base-button base-button--inactive')
  })

  it('renders with new-file theme when passed as prop', () => {
    const theme = Theme.NEW_FILE
    const wrapper = shallowMount(BaseButton, { props: { theme }})
    expect(wrapper.attributes('class')).toBe('base-button base-button--new-file')
  })
})
