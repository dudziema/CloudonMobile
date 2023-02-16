<script lang="ts" setup>
import { ShallowRef, shallowRef } from 'vue'
import { useContext } from '@/composables/context'
import IconTrash from '@/assets/images/iconsFiles/IconTrash.svg'
import IconDownload from '@/assets/images/iconsFiles/IconDownload.svg'
import File from '@/types/File'
import { iconForExtentionDictionary } from '@/utils/extentionsDictionary'

interface Props {
  file: File
}

const { file } = defineProps<Props>()
const ctx = useContext()
const { modalService } = ctx

const openModalDeleteFile = () => {
  modalService.open({
    title: 'Delete file',
    description: 'Are you sure? Deleting a file will permamently remove it from your inventory.',
    buttonAction: {
      text: 'Delete',
      callback: () => {
        webSocketService.deleteFile(file.name)
        modalService.close()
      },
    },
  })
}

const { webSocketService } = ctx

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
</script>

<template>
  <tr class="file-item-row">
    <td
      class="file-item-field file-item-field__image"
      data-testid="file-icon"
    >
      <component
        :is="iconForExtentionDictionary[file.type]"
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
</style>
