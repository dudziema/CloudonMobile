import { computed, ref } from 'vue'
import type { File } from '@/types/File'
import type { Chips } from '@/types/Chips'

const SECONDS_PER_DAY = 86400
const DAYS_IN_MONTH = 30

export default function useSearchAndFilter() {
  const mainFilters = ref({
    isAllFiles: true,
    isRecentFiles: false,
  })
  const allFiles = ref<File[]>([])
  const recentFiles = computed(()=> {
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000)
    const monthAgoTimestamp = currentTimestampInSeconds - SECONDS_PER_DAY * DAYS_IN_MONTH

    return allFiles.value?.filter(file => file.date_epoch > monthAgoTimestamp)
  })
  const baseFiles = computed(() => {
    return mainFilters.value.isAllFiles ? allFiles.value : recentFiles.value
  })

  const searchText = ref('')
  const listOfCategoriesSelected = ref<string[]>([])
  const isDuringSearch =  computed(()=> searchText.value.length > 0 || listOfCategoriesSelected.value.length > 0)

  const filteredFiles = ref<File[]>([])

  const getChipsSelected = (categories: Chips[])=> {
    if(categories !== undefined){
      listOfCategoriesSelected.value = categories
        .filter((chips: Chips) => chips.isClicked === true)
        .map((chips: Chips) => chips.chipsName)
    }
  }

  const turnOnRecentFiles = () => {
    mainFilters.value.isRecentFiles = true
    mainFilters.value.isAllFiles = false
  }

  const turnOnAllFiles = () => {
    mainFilters.value.isRecentFiles = false
    mainFilters.value.isAllFiles = true
  }

  const searchByTextAndCategory = () => {
    if(searchText.value) {
      if(listOfCategoriesSelected.value.length) {
        const filteredValues = baseFiles.value.filter((file: File) =>
          listOfCategoriesSelected.value.some((category: string) => file.type?.includes(category)))

        return filteredValues.filter((file: File) =>
          file.name.toLowerCase().includes(searchText.value.toLowerCase()))
      }

      return baseFiles.value.filter((file: File) =>
        file.name.toLowerCase().includes(searchText.value.toLowerCase()))
      
    } else {
      if(listOfCategoriesSelected.value.length) {
        return baseFiles.value.filter((file: File) =>
          listOfCategoriesSelected.value.some((category: string) => file.type?.includes(category)))
      }

      return baseFiles.value
    }
  }

  const filteredAndSortedFiles = computed(() => {
    if(!isDuringSearch.value) {
      return baseFiles.value
    }

    return searchByTextAndCategory()

  })
  // SEARCH BY TEXT AND/OR CATEGORY

  const findFile = (text: string, categories: Chips[]) => {
    searchText.value = text

    getChipsSelected(categories)
  
    if(!listOfCategoriesSelected.value.length  && !searchText.value) return  clearSearch()
  
    searchByTextAndCategory()
  }

  function clearSearch() {
    searchText.value = ''
  }
  
  // SORT TABLE
  const sortTable = (headerName: string)=> {
    if (headerName === 'name') sortName()
    if (headerName === 'time') sortByEpochDate()
  }

  const ASC = 'asc'
  const DSC = 'dsc'
  const sortDirections = ref<{ [key: string]: string }>({'name': ASC, 'time': ASC })

  function sortName() {
    sortDirections.value.name = sortDirections.value.name  === ASC ? DSC : ASC

    filteredFiles.value.sort((a: File, b: File) => {
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()

      if (sortDirections.value.name === ASC) {
        return nameA.localeCompare(nameB )
      } else {
        return nameB.localeCompare(nameA)
      }
    })
  }

  function sortByEpochDate() {
    sortDirections.value.time = sortDirections.value.time  === ASC ? DSC : ASC
    
    filteredFiles.value.sort((a: File, b: File) => {
      if(!a.date_epoch && !b.date_epoch) return 0
      const dateA = a.date_epoch
      const dateB = b.date_epoch
  
      if (sortDirections.value.time === ASC) {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })
  }

  return {
    searchText,
    allFiles,
    recentFiles,
    mainFilters,
    filteredFiles,
    isDuringSearch,
    sortDirections,
    filteredAndSortedFiles,
    getChipsSelected,
    findFile,
    sortTable,
    clearSearch,
    searchByTextAndCategory,
    turnOnRecentFiles,
    turnOnAllFiles,
    baseFiles
  }
}
