import { computed, ref } from 'vue'

import type { Chips } from '@/types/Chips'
import type { File } from '@/types/File'
import type { SortDirections } from '@/types/search-and-filter/SortDirections'

import { SortOrderEnum } from '@/types/search-and-filter/SortOrderEnum'

const SECONDS_PER_DAY = 86400
const DAYS_IN_MONTH = 30

export function useSearchAndFilter() {
  const allFiles = ref<File[]>([])
  const recentFiles = computed(()=> {
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000)
    const monthAgoTimestamp = currentTimestampInSeconds - SECONDS_PER_DAY * DAYS_IN_MONTH

    return allFiles.value?.filter(file => file.date_epoch > monthAgoTimestamp)
  })
  const baseFiles = computed(() =>mainFilters.value.isAllFiles ? allFiles.value : recentFiles.value)

  // Switch between All Files and Recent Files
  const mainFilters = ref({
    isAllFiles: true,
    isRecentFiles: false,
  })

  const turnOnRecentFiles = () => {
    mainFilters.value.isRecentFiles = true
    mainFilters.value.isAllFiles = false
  }

  const turnOnAllFiles = () => {
    mainFilters.value.isRecentFiles = false
    mainFilters.value.isAllFiles = true
  }

  // Search by name and filter by categories
  const searchText = ref('')
  const listOfCategoriesSelected = ref<string[]>([])
  const isDuringSearch =  computed(()=> searchText.value.length > 0 || listOfCategoriesSelected.value.length > 0)

  const filteredFiles = computed(() => {
    let files = baseFiles.value

    if (isDuringSearch.value) {
      if (searchText.value) {
        files = files.filter(file => file.name.toLowerCase().includes(searchText.value.toLowerCase()))
      }

      if (listOfCategoriesSelected.value.length) {
        files = files.filter(file => listOfCategoriesSelected.value.some(category => file.type?.includes(category)))
      }
    }

    return files
  })

  const findFile = (text: string, categories: Chips[]) => {
    searchText.value = text
    getChipsSelected(categories)
  }

  const getChipsSelected = (categories: Chips[])=> {
    if(categories !== undefined){
      listOfCategoriesSelected.value = categories
        .filter((chips: Chips) => chips.isClicked === true)
        .map((chips: Chips) => chips.chipsName)
    }
  }

  const clearSearch = () => {
    searchText.value = ''
    listOfCategoriesSelected.value = []
  }
  
  // Sort by name and time
  const { ASC, DSC } = SortOrderEnum
  const sortDirections = ref<SortDirections>({'name': ASC, 'time': ASC })

  const sortTable = (headerName: string)=> {
    if (headerName === 'name') sortName()
    if (headerName === 'time') sortByEpochDate()
  }

  const sortName = () =>{
    sortDirections.value.name = sortDirections.value.name  === ASC ? DSC : ASC

    filteredFiles.value.sort((a, b) => {
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()

      if (sortDirections.value.name === ASC) {
        return nameA.localeCompare(nameB)
      } else {
        return nameB.localeCompare(nameA)
      }
    })
  }

  const sortByEpochDate = () => {
    sortDirections.value.time = sortDirections.value.time  === ASC ? DSC : ASC
    
    filteredFiles.value.sort((a: File, b: File) => {
      if(!a.date_epoch && !b.date_epoch) return 0
      const dateA = a.date_epoch ?? 0
      const dateB = b.date_epoch ?? 0
  
      if (sortDirections.value.time === ASC) {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })
  }

  return {
    allFiles,
    baseFiles,
    isDuringSearch,
    filteredFiles,
    mainFilters,
    sortDirections,
    clearSearch,
    findFile,
    sortTable,
    turnOnAllFiles,
    turnOnRecentFiles
  }
}
