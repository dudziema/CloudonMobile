import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createContext } from '@/composables/context'
import FileItem from '@/components/ui/FileItem.vue'
import File from '@/types/File'
const { context } = createContext()

describe('FileItem', () => {
  let wrapper: VueWrapper<any>
  const file = { name: 'example.jpg', filename: 'example.jpg', size: 1000000, date_epoch: 1674815109 }

  beforeEach(() => {
    wrapper = shallowMount(FileItem, {
      global: {
        provide: {
          context: context
        }
      },
      props: { file },
    })
    
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it('should render the correct file name', () => {
    const name = wrapper.find('[data-testid=file-name]')
    expect(name.exists()).toBeTruthy()
    expect(name.text()).toContain(file.name)
  })

  it('should render the correct file size', () => {
    const size = wrapper.find('[data-testid=file-size]')
    expect(size.exists()).toBeTruthy()
    expect(size.text()).toContain('977 KB')
  })

  it('should render the correct file date', () => {
    const date = wrapper.find('[data-testid=file-dateEpoch]')
    expect(date.exists()).toBeTruthy()
    expect(date.text()).toContain('27.01.2023')
  })

  it('should render the correct file icon', () => {
    const icon = wrapper.find('[data-testid=file-icon]')
    expect(icon.exists()).toBeTruthy()
  })
})
