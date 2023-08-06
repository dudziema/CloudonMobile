<script lang="ts" setup>
import { shallowRef, ShallowRef, onMounted, ref, Ref, computed, ComputedRef, watch } from 'vue'
import { useContext } from '@/composables/context'
import { useRouter } from 'vue-router'

import TheWidget from '@/components/TheWidget.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseUpload from '@/components/ui/BaseUpload.vue'
import FileTable from '@/components/FileTable.vue'
import NoFilesSpace from '@/components/NoFilesSpace.vue'
import SearchBar from '@/components/ui/SearchBar.vue'

import ImageLogOut from '@/assets/images/buttons/ImageLogOut.svg'
import ImageLogo from '@/assets/images/buttons/ImageLogo.svg'
import ButtonAllFiles from '@/assets/images/buttons/ButtonAllFiles.svg'
import ButtonRecentFiles from '@/assets/images/buttons/ButtonRecentFiles.svg'

import File from '@/types/File'
import Theme from '@/types/Theme'
import Chips from '@/types/Chips'

const router = useRouter()
const ctx = useContext()
const { webSocketService, modalService } = ctx

const files: ShallowRef<File[]> = shallowRef([])
const tableHeaders: ShallowRef = shallowRef([
  { id: 0, label: 'image', field: '', sortable: false },
  { id: 1, label: 'name', field: 'NAME', sortable: true },
  { id: 2, label: 'size', field: 'FILE SIZE', sortable: false },
  { id: 3, label: 'time', field: 'UPLOAD DATE', sortable: true },
  { id: 4, label: 'button', field: '', sortable: false },
  { id: 5, label: 'button', field: '', sortable: false },
])

onMounted(() => {
  refreshFilesList()
})

async function refreshFilesList() {
  await webSocketService.wsListFiles((listFiles: File[]) => {
    files.value = listFiles
    filteredFiles.value = files.value
  })
}

function disconnect() {
  modalService.open({
    title: 'Disconnect account',
    description: 'Are you sure you want to proceed?',
    buttonAction: {
      text: 'Disconnect',
      callback: () => {
        webSocketService.disconnect()
        modalService.close()
        router.push('/')
      },
    },
  })
}

const selectedFiles: Ref<File[]> = ref([])
const quantityItemsSelected: ComputedRef<number> = computed(()=>selectedFiles.value.length)
const quantityFileName: ComputedRef<'files' | 'file'> = computed(() => quantityItemsSelected.value > 1 ?
  'files' : 'file')
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
    title: `Delete ${ quantityItemsSelected.value } ${ quantityFileName.value }`,
    description: `Are you sure? Deleting ${ quantityItemsSelected.value } ${ quantityFileName.value } will be permamently removed from your inventory.`,
    buttonAction: {
      text: 'Delete',
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
const title: ShallowRef<string> = shallowRef('All files')

const listOfCategoriesSelected: Ref<string[]> = ref([])

function findFile(searchText: string, categories: Chips[]) {
  title.value = 'Search results'

  if(categories !== undefined){
    listOfCategoriesSelected.value = categories
      .filter((chips: Chips) => chips.clicked === true)
      .map((chips: Chips) => chips.name)
  }

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

function clearSearch() {
  filteredFiles.value = files.value
  title.value = 'All files'
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
    const dateA = a.date_epoch
    const dateB = b.date_epoch

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
</script>

<template>
  <div class="dashboard-files">
    <div class="dashboard-files__left">
      <div class="dashboard-files__left-up">
        <p class="dashboard-files__logo">
          <ImageLogo />Cloud On Mobile
        </p>

        <BaseUpload
          class="dashboard-files__button-new-file"
          label="+ Add new file"
        />
        <BaseButton
          :class="isAllFilesBtnActive ? 'dashboard-files__button-all-files dashboard-files__button-all-files--active'
            : 'dashboard-files__button-all-files'"
          :theme="Theme.SIMPLY"
          @click="allFiles"
        >
          <ButtonAllFiles /> All files
        </BaseButton>
      
        <BaseButton
          :class="isRecentFilesBtnActive ?
            'dashboard-files__button-recent-files dashboard-files__button-recent-files--active' :
            'dashboard-files__button-recent-files'"
          :theme="Theme.SIMPLY"
          @click="sortRecentFiles"
        >
          <ButtonRecentFiles /> Recent files
        </BaseButton>
      </div>
        
      <BaseButton
        class="dashboard-files__disconnect"
        :theme="Theme.SIMPLY"
        @click="disconnect"
      >
        <ImageLogOut />
        
        <span class="dashboard-files__disconnect-text">Disconnect</span>
      </BaseButton>
    </div>
    <SearchBar
      class="dashboard-files__search-bar"
      @search="findFile"
      @clear-search="clearSearch"
    />

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
      v-else-if="!filteredFiles.length && title === 'Search results'"
      class="dashboard-files__files dashboard-files__files--search"
    >
      Oops, we didn't find any files matching your search criteria.
    </div>

    <NoFilesSpace
      v-else-if="!files.length"
      class="dashboard-files__files"
    />
  </div>
</template>

<style lang="scss" scoped>
.dashboard-files {
  display: grid;
  grid-auto-rows: auto;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(9, 1fr);
  gap: 8px 8px;
  height: 100vh;
  overflow: hidden;
  max-width: 1520px;
  width: 100%;
  margin: 8px;

  &__left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 10;
    padding-right: 20px;
    margin-bottom: 12px;

    &-up {
      padding: 10px;
    }
  }
  &__disconnect {
    grid-row-start: 9;
    grid-row-end: 10;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-content: center;

    &-text {
      margin: 12px;
    }
  }

  &__button-new-file {
    width: 100%;
    margin: 16px 0;
  }

  &__button-all-files {
    color: var(--primary-100, #0E70F1);
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px; /* 150% */
    letter-spacing: 0.048px;
    gap: 16px;
    padding: 0 8px;
    width: 100%;
    &--active {
      border-radius: 8px;
      background: var(--primary-10, #F5FAFF);
    }
  }

  &__button-recent-files {
    color: var(--black, #0C0C0C);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Body/16/Regular */
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    letter-spacing: 0.048px;
    gap: 16px;
    padding: 0 8px;
    width: 100%;
    &--active {
      border-radius: 8px;
      background: var(--primary-10, #F5FAFF);
    }
  }

  &__files {
    position: relative;
    width: 100%;
    grid-column-start: 3;
    grid-column-end: 11;
    grid-row-start: 3;
    grid-row-end: 10;
    margin-bottom: 40px;

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
  &__logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
    &__search-bar {
      grid-column-start: 3;
      grid-column-end: 11;
      grid-row-start: 1;
      grid-row-end: 1;
    }
  &__title {
    grid-column-start: 3;
    grid-column-end: 11;
    grid-row-start: 2;
    grid-row-end: 2;
  }
  &__button {
    width: 100%;
    margin-top: 30px;
  }
}
</style>
