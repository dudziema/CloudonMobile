<script lang="ts" setup>
import { ref } from 'vue'
import { useContext } from '@/composables/context'
import IconTrash from '@/assets/images/iconsFiles/IconTrash.vue'
import IconDownload from '@/assets/images/iconsFiles/IconDownload.vue'
import IconImage from '@/assets/images/iconsFiles/IconImage.vue'
import IconDoc from '@/assets/images/iconsFiles/IconDoc.vue'
import IconFilm from '@/assets/images/iconsFiles/IconFilm.vue'
import IconMusic from '@/assets/images/iconsFiles/IconMusic.vue'
import File from '@/types/File'
import Message from '@/types/Message'
import MessageCommands from '@/types/MessageCommands'
import MessageTypes from '@/types/MessageTypes'

interface Props {
  file: File
}

const { file } = defineProps<Props>()
const ctx = useContext()
const { webSocketService } = ctx
const ZERO_IN_DATE = '0'
const ONE_IN_MONTH = 1
const TWO_DIGIT_VALUE = 10
const MILISECONDS = 1000
const extentionsList = ref([
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
  const sizes = ['Bytes', 'KB', 'MB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i]
}

function formatTime(epochTime: number) {
  const date: Date = new Date(epochTime * MILISECONDS)
  const uDay = date.getDate() < TWO_DIGIT_VALUE ? ZERO_IN_DATE + date.getDate() : date.getDate()
  const uMonth = date.getMonth() + ONE_IN_MONTH < TWO_DIGIT_VALUE ?
    ZERO_IN_DATE + (date.getMonth() + ONE_IN_MONTH) : date.getMonth() + ONE_IN_MONTH
  const uYear = date.getFullYear()
  const uploadDate = uDay + '.' + uMonth + '.' + uYear

  return uploadDate
}

function getExtention(value: string) {
  var getExtention = value.split('.')

  return getExtention[1]
}

function getIcon(ext: string) {
  let extentionIcon = extentionsList.value.find(item => {
    let { extention } = item

    if (Array.isArray(extention)) {
      return extention.includes(ext)
    } else if (typeof extention === 'string') {
      return extention === ext
    }
  }) || {}

  return extentionIcon.icon || extentionsList.value[1].icon
}
</script>

<template>
  <tr class="file-item-row">
    <td class="file-item-field file-item-field__image">
      <component :is="getIcon(getExtention(file.name))" />
    </td>
    <td class="file-item-field file-item-field__name">{{ file.name }}</td>
    <td class="file-item-field file-item-field__size">
      {{ formatBytes(file.size, 0) }}
    </td>
    <td class="file-item-field file-item-field__time">
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
          @click="webSocketService.deleteFile(file.name)"
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
