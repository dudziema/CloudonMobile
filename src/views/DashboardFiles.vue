<script lang="ts" setup>
import { shallowRef, ShallowRef, onMounted, ref, Ref, computed, ComputedRef, watch } from 'vue'
import { useContext } from '@/composables/context'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

import TheWidget from '@/components/TheWidget.vue'
import FileTable from '@/components/FileTable.vue'
import NoFilesSpace from '@/components/NoFilesSpace.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import LeftMenu from '@/components/LeftMenu.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'
import ButtonMenu from '@/assets/images/buttons/ButtonMenu.svg'

import File from '@/types/File'
import Chips from '@/types/Chips'
import Message from '@/types/Message'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const ctx = useContext()
const route = useRoute()
const router = useRouter()
const { webSocketService, modalService } = ctx

const files: ShallowRef<File[]> = shallowRef([])
const tableHeaders: ShallowRef = shallowRef([
  { id: 0, label: 'image', field: '', sortable: false },
  { id: 1, label: 'name', field: t('dashboard.fileName'), sortable: true },
  { id: 2, label: 'size', field: t('dashboard.fileSize'), sortable: false },
  { id: 3, label: 'time', field: t('dashboard.fileTime'), sortable: true },
  { id: 4, label: 'button', field: '', sortable: false },
  { id: 5, label: 'button', field: '', sortable: false },
  { id: 6, label: 'button-more', field: '', sortable: false }
])

const ifErrorShowModal = () => {
  modalService.open({
    title: t('dashboard.errorModalTitle'),
    description: t('dashboard.errorModalDescription'),
    buttonAction: {
      text: t('dashboard.close'),
      callback: () => {
        modalService.close()
        router.push('/')
      }
    },
    isCancel: false
  })
}

const isPasscodeCorrect =ref<boolean| null>(null) //@to-do Add handling wrong input in url
const regexPattern = /^\d{6}$/
const isCodeValid = computed(() => regexPattern.test(route.params.passcode as string))

onMounted(() => {
  if(!isCodeValid.value) {
    modalService.open({
      title: 'Incorrect passcode  :(',
      description: 'Check passcode if have 6 digits and provide correct input. Please, try again.',
      buttonAction: {
        text: 'Close',
        callback: () => {
          modalService.close()
          router.push('/')
        }
      },
      isCancel: false
    })

    return
  }

  if(!webSocketService.isConnectedValue){
    webSocketService.addWsOnMessageListener(function (messageFromServer: Message) {
      if(messageFromServer.result) {
        // Wrong passcode
        isPasscodeCorrect.value = false
      } else if(!messageFromServer.result) {
        // Correct passcode
        isPasscodeCorrect.value = true
        refreshFilesList()
      }
    })
    const passcode = parseInt(route.params.passcode as string)
    webSocketService.login(passcode, ifErrorShowModal)
  } else {
    refreshFilesList()
  }
})

async function refreshFilesList() {
  await webSocketService.wsListFiles((listFiles: File[]) => {
    files.value = listFiles
    filteredFiles.value = files.value
  })
}

const selectedFiles: Ref<File[]> = ref([])
const quantityItemsSelected: ComputedRef<number> = computed(()=>selectedFiles.value.length)
const quantityFileName: ComputedRef<string> = computed(() => quantityItemsSelected.value > 1 ?
  t('dashboard.files') : t('dashboard.file'))
const clearItems: Ref<boolean> = ref(false)

function itemsSelected(itemsSelected: File[]) {
  selectedFiles.value = itemsSelected
}

function downloadFiles() {
  clearItems.value = true
  selectedFiles.value.forEach(file => {
    webSocketService.downloadFile(file.name)
  })
  clearItems.value = false
  closeWidgetClicked.value = true
}

function deleteFiles() {
  modalService.open({
    title: `${t('dashboard.delete')} ${ quantityItemsSelected.value } ${ quantityFileName.value }`,
    description: `${t('dashboard.areYouSureText')} ${ quantityItemsSelected.value } ${ quantityFileName.value } ${t('dashboard.areYouSureTextContinued')}`,
    buttonAction: {
      text: t('dashboard.delete'),
      callback: () => {
        selectedFiles.value.forEach(file => {
          webSocketService.deleteFile(file.name)
        })
        clearItems.value = false
        closeWidgetClicked.value = true
        modalService.close()
      },
    },
  })
}

const closeWidgetClicked: Ref<boolean> = ref(false)

function closeWidget() {
  closeWidgetClicked.value = true
}

watch(quantityItemsSelected, newValue => {
  if(!newValue) closeWidgetClicked.value = false
})
const filteredFiles: ShallowRef<File[]> = shallowRef([])
const title: ShallowRef<string> = shallowRef(t('dashboard.allFiles'))

const listOfCategoriesSelected: Ref<string[]> = ref([])

function getChipsSelected(categories: Chips[]) {
  if(categories !== undefined){
    listOfCategoriesSelected.value = categories
      .filter((chips: Chips) => chips.clicked === true)
      .map((chips: Chips) => chips.name)
  }
}

function searchByTextAndCategory(searchText: string) {
  title.value = 'Search results'

  if(searchText) {
    if(listOfCategoriesSelected.value.length) {
      const filteredValues = files.value.filter((file: File) =>
        listOfCategoriesSelected.value.some((category: string) => file.type?.includes(category)))
      filteredFiles.value = filteredValues.filter((file: File) =>
        file.name.toLowerCase().includes(searchText.toLowerCase()))
    } else {
      filteredFiles.value = files.value.filter((file: File) =>
        file.name.toLowerCase().includes(searchText.toLowerCase()))
    }
  } else {
    if(listOfCategoriesSelected.value.length) {
      filteredFiles.value = files.value.filter((file: File) =>
        listOfCategoriesSelected.value.some((category: string) => file.type?.includes(category)))
    } else {
      filteredFiles.value = files.value
    }
  }
}

function findFile(searchText: string, categories: Chips[]) {
  getChipsSelected(categories)

  if(!listOfCategoriesSelected.value.length  && !searchText) return  clearSearch()

  searchByTextAndCategory(searchText)
}

function clearSearch() {
  filteredFiles.value = files.value
  title.value = t('dashboard.allFiles')
}

const ASC = 'asc'
const DSC = 'dsc'
const sortDirections: Ref<{ [key: string]: string }> = ref({'name': ASC, 'time': ASC })

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
    const dateA = a.date_epoch!
    const dateB = b.date_epoch!

    if (sortDirections.value.time === ASC) {
      return dateA - dateB
    } else {
      return dateB - dateA
    }
  })
}

function sortTable(headerName: string) {
  if (headerName === 'name') sortName()
  if (headerName === 'time') sortByEpochDate()
}

const isAllFilesBtnActive = ref(false)
const isRecentFilesBtnActive = ref(false)

function sortRecentFiles() {
  isRecentFilesBtnActive.value = true
  isAllFilesBtnActive.value = false
  sortDirections.value.time = DSC
  sortByEpochDate()
}

function allFiles() {
  isRecentFilesBtnActive.value = false
  isAllFilesBtnActive.value = true
  refreshFilesList()
}

const isBurgerMenuOpen = ref(false)
</script>

<template>
  <div class="dashboard-files">
    <div class="dashboard-files__left">
      <LeftMenu
        :is-all-files-btn-active="isAllFilesBtnActive"
        :is-recent-files-btn-active="isRecentFilesBtnActive"
        @all-files="allFiles"
        @sort-recent-files="sortRecentFiles"
      />
    </div>

    <BurgerMenu
      class="dashboard-files__burger-menu"
      :is-all-files-btn-active="isAllFilesBtnActive"
      :is-recent-files-btn-active="isRecentFilesBtnActive"
      :is-burger-menu-open="isBurgerMenuOpen"
      @all-files="allFiles"
      @sort-recent-files="sortRecentFiles"

      @close-burger-menu="isBurgerMenuOpen = false"
    />
    <div class="dashboard-files__main">
      <div class="dashboard-files__main-search">
        <ButtonMenu
          class="dashboard-files__main-search-menu"
          @click="isBurgerMenuOpen = true"
        />

        <SearchBar
          class="dashboard-files__search-bar"
          @search="findFile"
          @clear-search="clearSearch"
        />
      </div>

      <h1 class="dashboard-files__title">
        {{ title }}
      </h1>

      <div
        v-if="filteredFiles.length"
        class="dashboard-files__files dashboard-files__files--full"
        @dragover.prevent
        @dragenter.prevent
        @dragleave.prevent="onDrop"
        @drop.prevent="onDrop"
      >
        <FileTable
          :files="filteredFiles"
          :table-headers="tableHeaders"
          :clear-items="clearItems"
          :close-widget-clicked="closeWidgetClicked"
          :sort-directions="sortDirections"
          @items-selected="itemsSelected"
          @sort-table="sortTable"
        />

        <TheWidget
          v-if="quantityItemsSelected"
          :quantity-items-selected="quantityItemsSelected"
          @download="downloadFiles"
          @delete="deleteFiles"
          @close-widget="closeWidget"
        />
      </div>

      <div
        v-else-if="!filteredFiles.length && title === t('dashboard.searchResult')"
        class="dashboard-files__files dashboard-files__files--search"
      >
        {{ $t("dashboard.filesNotFound") }}
      </div>

      <NoFilesSpace
        v-else-if="!files.length"
        class="dashboard-files__files"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-files {
  height: 100vh;
  display: grid;
  grid-auto-rows: auto;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(9, 1fr);
  gap: 8px 8px;
  // height: 100vh;
  // overflow: hidden;
  max-width: 1520px;
  width: 100%;
  // margin: 8px;

  &__title {
    margin: 12px 0;
  }

  &__left {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 10;
    padding-right: 20px;
    margin-bottom: 12px;

    @include devices(tablet) {
      display: none;
    }
  }

  &__burger-menu {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 10;
    padding-right: 20px;

    @include devices(only-desktop) {
      display: none;
    }
  }

  &__main {
    position: relative;
    padding: 15px;
    width: 100%;
    grid-column-start: 3;
    grid-column-end: 11;
    grid-row-start: 1;
    grid-row-end: 9;
    height: 100vh;

    @include devices(tablet) {
      grid-column-start: 1;
    }

    &-search {
      display: flex;
      gap: 4px;

      @include devices(only-desktop) {
        gap: 24px;
    }

      &-menu {
        margin-top: 8px;
        min-height: 40px;
    min-width: 40px;

        @include devices(only-desktop) {
          display: none;
        }
      }
    }
  }

  &__files {
    height: calc(100vh - 215px);
    overflow: auto;

    &--full {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      overflow: auto;
    }
    &--search {
      font-weight: 200;
    }
    
    &-content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }

  &__button {
    width: 100%;
    margin-top: 30px;
  }
}
</style>
