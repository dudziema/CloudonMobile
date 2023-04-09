<script lang="ts" setup>
import { shallowRef, ShallowRef, onMounted, ref, Ref, computed } from 'vue'
import { useContext } from '@/composables/context'
import { useRouter } from 'vue-router'
import TheWidget from '@/components/TheWidget.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseUpload from '@/components/ui/BaseUpload.vue'
import FileTable from '@/components/FileTable.vue'
import NoFilesSpace from '@/components/NoFilesSpace.vue'
import ImageLogOut from '@/assets/images/buttons/ImageLogOut.svg'
import ImageLogo from '@/assets/images/buttons/ImageLogo.svg'
import File from '@/types/File'
import Theme from '@/types/Theme'

const router = useRouter()
const ctx = useContext()
const { webSocketService, modalService } = ctx

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
  })
}

function disconnect() {
  webSocketService.disconnect()
  router.push('/')
}

onMounted(() => {
  refreshFilesList()
})

const selectedFiles: Ref<File[]> = ref([])
const quantityItemsSelected = computed(()=>selectedFiles.value.length)
const quantityFileName = computed(() => quantityItemsSelected.value > 1 ? 'files' : 'file')

function itemsSelected(itemsSelected: File[]) {
  selectedFiles.value = itemsSelected
}

function downloadFiles() {
  selectedFiles.value.forEach(file => {
    webSocketService.downloadFile(file.name)
  })
  selectedFiles.value=[]
}
const clearItems = ref(false)

function deleteFiles() {
  clearItems.value = false
  modalService.open({
    title: `Delete ${ quantityItemsSelected.value } ${ quantityFileName.value }`,
    description: `Are you sure? Deleting ${ quantityItemsSelected.value } ${ quantityFileName.value } will be permamently removed from your inventory.`,
    buttonAction: {
      text: 'Delete',
      callback: () => {
        selectedFiles.value.forEach(file => {
          webSocketService.deleteFile(file.name)
        })
        clearItems.value = true
        modalService.close()
      },
    },
  })
}

function closeWidget() {
  console.log('clicked')
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

    <h1 class="dashboard-files__title">
      All files
    </h1>

    <div
      v-if="files.length !== 0"
      class="dashboard-files__files dashboard-files__files--full"
      @dragover.prevent
      @dragenter.prevent
      @dragleave.prevent="onDrop"
      @drop.prevent="onDrop"
    >
      <FileTable
        :files="files"
        :table-headers="tableHeaders"
        :clear-items="clearItems"
        @items-selected="itemsSelected"
      />

      <TheWidget
        v-if="quantityItemsSelected"
        :quantity-items-selected="quantityItemsSelected"
        @download="downloadFiles"
        @delete="deleteFiles"
        @close-widget="closeWidget"
      />
    </div>

    <NoFilesSpace v-else />
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
    position:relative;
    width: 100%;
    grid-column-start: 3;
    grid-column-end: 11;
    grid-row-start: 2;
    grid-row-end: 9;

    &--full {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
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
  &__title {
    grid-column-start: 3;
    grid-column-end: 11;
    grid-row-start: 1;
    grid-row-end: 1;
  }
  &__button {
    width: 100%;
    margin-top: 30px;
  }
}
</style>
