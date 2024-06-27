<script lang="ts" setup>
import { computed, onMounted, ref,shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import BurgerMenu from '@/components/BurgerMenu.vue'
import FileTable from '@/components/FileTable.vue'
import LeftMenu from '@/components/LeftMenu.vue'
import NoFilesSpace from '@/components/NoFilesSpace.vue'
import TheWidget from '@/components/TheWidget.vue'
import SearchBar from '@/components/ui/SearchBar.vue'

import { useContext } from '@/composables/context'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useFilesActions } from '@/composables/useFilesActions'
import { useSearchAndFilter } from '@/composables/useSearchAndFilter'

import ButtonMenu from '@/assets/images/buttons/ButtonMenu.svg'

import type { File } from '@/types/File'
import type { MessageReceived } from '@/types/message-received/MessageReceived'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const ctx = useContext()
const { webSocketService, modalService } = ctx

const { ifErrorShowModal,onDrop } = useDragAndDrop()

const {
  clearItems,
  closeWidgetClicked,
  quantityItemsSelected,
  closeWidget,
  deleteFiles,
  downloadFiles,
  itemsSelected
} = useFilesActions()

const {
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
} = useSearchAndFilter()

onMounted(() => {
  if(!isCodeValid.value) {
    handleInvalidCode()
  } else if(!webSocketService.isConnectedValue){
    handleServerConnection()
  } else {
    handleRefreshList()
  }
})

const tableHeaders = shallowRef([
  { id: 0, label: 'image', field: '', sortable: false },
  { id: 1, label: 'name', field: t('dashboard.fileName'), sortable: true },
  { id: 2, label: 'size', field: t('dashboard.fileSize'), sortable: false },
  { id: 3, label: 'time', field: t('dashboard.fileTime'), sortable: true },
  { id: 4, label: 'button', field: '', sortable: false },
  { id: 5, label: 'button', field: '', sortable: false },
  { id: 6, label: 'button-more', field: '', sortable: false }
])

const isAllFilesBtnActive =  computed(()=> mainFilters.value.isAllFiles)
const isRecentFilesBtnActive = computed(()=> mainFilters.value.isRecentFiles)

const title = computed(()=>
  isDuringSearch.value
    ? t('dashboard.searchResult')
    : isRecentFilesBtnActive.value
      ? t('dashboard.recentFilesDetails')
      : t('dashboard.allFiles'))

const isBurgerMenuOpen = ref(false)

function butonFileUploadClicked() {
  isBurgerMenuOpen.value = false
}
const isPasscodeCorrect = ref<boolean | null>(null)
const regexPattern = /^\d{6}$/
const isCodeValid = computed(() => regexPattern.test(route.params.passcode as string))

const handleInvalidCode = () => {
  modalService.open({
    title: t('dashboard.errorPasscodeTitle'),
    description: t('dashboard.errorPasscodeDescription'),
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

const handleServerConnection = () => {
  webSocketService.addWsOnMessageListener(function (messageFromServer: MessageReceived) {
    if(messageFromServer?.result) {
      // Wrong passcode
      isPasscodeCorrect.value = false
    } else if(!messageFromServer?.result) {
      // Correct passcode
      isPasscodeCorrect.value = true
      handleRefreshList()
    }
  })
  const passcode = parseInt(route.params.passcode as string)
  webSocketService.login(passcode, ifErrorShowModal)
}

const handleRefreshList = async () => {
  if(isDuringSearch.value) return

  await webSocketService.wsListFiles((listFiles: File[]) => {
    allFiles.value = listFiles
  })
}

watch(quantityItemsSelected, newValue => {
  if(!newValue) closeWidgetClicked.value = false
})
</script>

<template>
  <div class="dashboard-files">
    <div class="dashboard-files__left">
      <LeftMenu
        :is-all-files-btn-active="isAllFilesBtnActive"
        :is-recent-files-btn-active="isRecentFilesBtnActive"
        @all-files="turnOnAllFiles"
        @sort-recent-files="turnOnRecentFiles"
        @buton-file-upload-clicked="butonFileUploadClicked"
      />
    </div>

    <BurgerMenu
      class="dashboard-files__burger-menu"
      :is-all-files-btn-active="isAllFilesBtnActive"
      :is-recent-files-btn-active="isRecentFilesBtnActive"
      :is-burger-menu-open="isBurgerMenuOpen"
      @all-files="turnOnAllFiles"
      @sort-recent-files="turnOnRecentFiles"
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
        v-else-if="!filteredFiles.length && isDuringSearch && !isRecentFilesBtnActive"
        class="dashboard-files__files dashboard-files__files--search"
      >
        {{ $t("dashboard.filesNotFound") }}
      </div>

      <div
        v-else-if="!filteredFiles.length && isDuringSearch && isRecentFilesBtnActive"
        class="dashboard-files__files dashboard-files__files--recent"
      >
        {{ $t("dashboard.areNotRecentFiles") }}
        <br />
        {{ $t("dashboard.areNotRecentFilesSubtitle") }}
      </div>

      <NoFilesSpace
        v-else-if="!baseFiles.length"
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
  gap: $gap-default $gap-default;
  max-width: 1520px;
  width: 100%;

  &__title {
    margin: $spacing-horizontal-medium 0;
  }

  &__left {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 10;
    padding-right: calc(2 * $spacing-horizontal-default);
    margin-bottom: $spacing-horizontal-medium;

    @include devices(tablet) {
      display: none;
    }
  }

  &__burger-menu {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 10;
    padding-right: calc(2 * $spacing-horizontal-default);

    @include devices(only-desktop) {
      display: none;
    }
  }

  &__main {
    position: relative;
    padding: $spacing-horizontal-big 32px $spacing-horizontal-big $spacing-horizontal-big;
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
      gap: $gap-small;

      @include devices(only-desktop) {
        gap: calc(2 * $gap-big);
      }

      &-menu {
        margin-top: $spacing-horizontal-small;
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
    overflow-y: auto;
    
    &--full {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      overflow: auto;
      height: calc(100vh - 215px);
      overflow-y: auto;
      overflow-x: hidden
    }

    &--search {
      font-weight: $font-weight-thin;
    }

    &--recent {
      font-weight: $font-weight-thin;

      @include devices(tablet) {
        font-size: $font-size-small;
      }
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
    margin-top: calc(3 * $spacing-horizontal-default);
  }
}

/* Initially show the scrollbar */
::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
}

/* Style the scrollbar track */
::-webkit-scrollbar-track {
  background: transparent; /* Background color of the track */
}

/* Style the scrollbar thumb */
::-webkit-scrollbar-thumb {
  background: #888888; /* Color of the thumb */
  border-radius: calc($radius-small / 2); /* Rounded corners for the thumb */
}

/* Hide the scrollbar thumb by default */
::-webkit-scrollbar-thumb {
  width: 0;
}

/* Show the scrollbar thumb on hover */
::-webkit-scrollbar-thumb:hover {
  width: 10px; /* Width of the thumb when hovered */
  background: #555; /* Color of the thumb on hover */
}

/* Style the scrollbar thumb when scrollbar is dragged */
::-webkit-scrollbar-thumb:active {
  background: #333; /* Color of the thumb when clicked/dragged */
}
</style>
