import { shallowMount, VueWrapper } from '@vue/test-utils'
import FileTable from '@/components/FileTable.vue'
import FileItem from '@/components/ui/FileItem.vue'
import File from '@/types/File'

describe('FileTable', () => {
  let wrapper: VueWrapper<any>
  const files: File[] = [
    { name: 'example1.jpg', filename: 'example1.jpg', size: 1000000, date_epoch: 1610733200000 },
    { name: 'example2.docx', filename: 'example2.docx', size: 2000000, date_epoch: 1610733200000 },
    { name: 'example3.mp4', filename: 'example3.mp4', size: 3000000, date_epoch: 1610733200000 },
  ]
  const tableHeaders: { label: string; field: string }[] = [
    { label: 'image', field: 'Image' },
    { label: 'name', field: 'Name' },
    { label: 'size', field: 'Size' },
    { label: 'time', field: 'Time' },
    { label: 'button', field: 'Button' },
  ]

  beforeEach(() => {
    wrapper = shallowMount(FileTable, {
      props: { files, tableHeaders },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the correct number of FileItem components', () => {
    expect(wrapper.findAllComponents(FileItem).length).toBe(files.length)
  })

  it('should render the correct table headers', () => {
    const headers = wrapper.findAll('[data-testid=table-headers]')
    expect(headers.length).toBe(tableHeaders.length)
    headers.forEach((header, index) => {
      expect(header.text()).toBe(tableHeaders[index].field)
    })
  })

  it('should pass the correct file props to each FileItem component', () => {
    const fileItems = wrapper.findAllComponents(FileItem)
    fileItems.forEach((fileItem, index) => {
      expect(fileItem.props().file).toStrictEqual(files[index])
    })
  })
})