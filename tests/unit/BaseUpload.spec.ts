import { mount, VueWrapper } from '@vue/test-utils'
import BaseUpload from '@/components/ui/BaseUpload.vue'
import { createContext } from '@/composables/context'

const { context } = createContext()
const MAX_SIZE_FILE_IN_BYTES = 104857600
const ONE_MEGABYTE = 1048576

describe('BaseUpload', () => {
  let wrapper: VueWrapper<any>
  
  beforeEach(() => {
    wrapper = mount(BaseUpload, {
      global: {
        provide: {
          context: context
        }
      }
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('isFileValid returns true when file size is less than 100MB', () => {
    const file = { size: MAX_SIZE_FILE_IN_BYTES - ONE_MEGABYTE }
    const result = wrapper.vm.isFileValid(file)
    expect(result).toBe(true)
  })

  it('isFileValid returns true when file size is more than 100MB', () => {
    const file = { size: MAX_SIZE_FILE_IN_BYTES + ONE_MEGABYTE }
    const result = wrapper.vm.isFileValid(file)
    expect(result).toBe(false)
  })

  it('addNewFile calls webSocketService.sendFile when file is valid', () => {
    const file = { size: MAX_SIZE_FILE_IN_BYTES - ONE_MEGABYTE }
    const event = { target: { files: [file] } }
    const spy = jest.spyOn(context.webSocketService, 'sendFile')
    wrapper.vm.addNewFile(event)
    expect(spy).toHaveBeenCalledWith(file)
  })

  it('addNewFile calls webSocketService.sendFile when file is invalid', () => {
    const file = { size: MAX_SIZE_FILE_IN_BYTES + ONE_MEGABYTE }
    const event = { target: { files: [file] } }
    const spy = jest.spyOn(context.webSocketService, 'sendFile')
    wrapper.vm.addNewFile(event)
    expect(spy).not.toHaveBeenCalled()
  })

  test('addNewFile should not call webSocketService.sendFile when there is no file selected', () => {
    const mockSendFile = jest.fn()
    context.webSocketService.sendFile = mockSendFile
    const event = { target: { files: [] } }
    wrapper.vm.addNewFile(event)
    expect(mockSendFile).not.toHaveBeenCalled()
  })
})
