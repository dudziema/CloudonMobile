<script lang="ts" setup>
import { ShallowRef, Ref, shallowRef, ref, watchEffect, watch,  computed, toRefs} from 'vue'
import { useContext } from '@/composables/context'
import IconTrash from '@/assets/images/iconsFiles/IconTrash.svg'
import IconDownload from '@/assets/images/iconsFiles/IconDownload.svg'
import IconImage from '@/assets/images/iconsFiles/IconImage.svg'
import IconDoc from '@/assets/images/iconsFiles/IconDoc.svg'
import IconFilm from '@/assets/images/iconsFiles/IconFilm.svg'
import IconMusic from '@/assets/images/iconsFiles/IconMusic.svg'
import File from '@/types/File'

interface ExtentionList {
  icon: string,
  extention: string[]
}

const props = defineProps<{
  file: File,
  allItemsSelected: boolean
}>()

const ctx = useContext()
const { modalService } = ctx

const openModalDeleteFile = () => {
  modalService.open({
    title: 'Delete file',
    description: 'Are you sure? Deleting a file will permamently remove it from your inventory.',
    buttonAction: {
      text: 'Delete',
      callback: () => {
        webSocketService.deleteFile(props.file.name)
        modalService.close()
      },
    },
  })
}

const { webSocketService } = ctx
const extentionsList: ShallowRef<ExtentionList[]> = shallowRef([
  { icon: IconImage, extention: ['jpg', 'jpeg', 'png', 'gif'] },
  {
    icon: IconDoc,
    extention: ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'],
  },
  { icon: IconFilm, extention: ['mp4', 'wmv', 'avi'] },
  { icon: IconMusic, extention: ['mp3'] },
])

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  if(!Number.isFinite(bytes) || bytes < 0) return 'Invalid input'
  const sizes = ['Bytes', 'KB', 'MB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(0)} ${sizes[i]}`
}

function formatTime(epochTime: number) {
  const date = new Date(epochTime * 1000)
  const formattedDate = date.toLocaleDateString()

  return formattedDate.replace(/\//g, '.')
}

function getIcon(fileName: string) {
  let extention = fileName.split('.').pop().split(/[?#]/)[0]
  let extentionListItem: ExtentionList = extentionsList.value.find(item => item.extention.includes(extention)) ||
    extentionsList.value[1]

  return extentionListItem.icon
}

const isSelected: Ref<boolean> = ref(false)
const emit = defineEmits(['isSelected'])

watch(props, newValue => {
  isSelected.value = newValue.allItemsSelected
})
watch(isSelected, newValue => {
  emit('isSelected', props.file, newValue)
})
</script>

<template>
  <tr class="file-item-row">
    <td>
      <input
        v-model="isSelected"
        type="checkbox"
        @click="toggleSelection"
      >
    </td>
    <td
      class="file-item-field file-item-field__image"
      data-testid="file-icon"
    >
      <component
        :is="getIcon(file.name)"
      />
    </td>
    <td
      class="file-item-field file-item-field__name"
      data-testid="file-name"
    >
      {{ file.name }}
    </td>
    <td
      class="file-item-field file-item-field__size"
      data-testid="file-size"
    >
      {{ formatBytes(file.size, 0) }}
    </td>
    <td
      class="file-item-field file-item-field__time"
      data-testid="file-dateEpoch"
    >
      {{ formatTime(file.date_epoch) }}
    </td>
    <td class="file-item-field file-item-field__button">
      <button class="file-item-field__button">
        <IconDownload
          class="file-item-field__download-icon"
          @click="webSocketService.downloadFile(file.name)"
        />
      </button>
    </td>
    <td class="file-item-field file-item-field__button">
      <button class="file-item-field__button">
        <IconTrash
          class="file-item-field__delete-icon"
          @click="openModalDeleteFile"
        />
      </button>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.file-item-row {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;

  &:hover {
    background: #f5faff;
    border-radius: 8px;
  }
}
.file-item-field {
  margin-right: 20px;
  &__button {
    width: 5%;
  }
  &__name {
    width: 50%;
  }

  &__image {
    width: 5%;
    border-radius: 8px;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  &__time {
    width: 15%;
    opacity: 0.6;
  }

  &__size {
    width: 15%;
    opacity: 0.6;
  }
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
  opacity: 0.2;
  border: 1px solid $color-border-primary;
  border-radius: 4px;
  margin: 12px;
}

input[type="checkbox"]:checked {
  opacity: 1;
}
</style>
