<script lang="ts" setup>
import { shallowRef, ShallowRef, onMounted, ref, Ref } from 'vue'
import { useContext } from '@/composables/context'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseUpload from '@/components/ui/BaseUpload.vue'
import FileTable from '@/components/FileTable.vue'
import NoFilesSpace from '@/components/NoFilesSpace.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import ImageLogOut from '@/assets/images/buttons/ImageLogOut.svg'
import ImageLogo from '@/assets/images/buttons/ImageLogo.svg'
import File from '@/types/File'
import Theme from '@/types/Theme'
import Chips from '@/types/Chips'

const router = useRouter()
const ctx = useContext()
const { webSocketService } = ctx

const files: ShallowRef<File[]> = shallowRef([])
const tableHeaders: ShallowRef = shallowRef([
  { label: 'image', field: '' },
  { label: 'name', field: 'NAME' },
  { label: 'size', field: 'FILE SIZE' },
  { label: 'time', field: 'UPLOAD DATE' },
  { label: 'button', field: '' },
  { label: 'button', field: '' },
])

async function refreshFilesList() {
  await webSocketService.wsListFiles((listFiles: File[]) => {
    files.value = listFiles
    filteredFiles.value = files.value
  })
}

function disconnect() {
  webSocketService.disconnect()
  router.push('/')
}

onMounted(() => {
  refreshFilesList()
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
</script>

<template>
  <div class="dashboard-files">
    <div class="dashboard-files__left">
      <div>
        <p class="dashboard-files__logo">
          <ImageLogo />Cloud On Mobile
        </p>

        <BaseUpload
          class="dashboard-files__button-new-file"
          label="+ Add new file"
        />
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

  &__left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 10;
    padding-right: 20px;
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
  }

  &__files {
    width: 100%;
    grid-column-start: 3;
    grid-column-end: 11;
    grid-row-start: 3;
    grid-row-end: 9;

    &--full {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
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
