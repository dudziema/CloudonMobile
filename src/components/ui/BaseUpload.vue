<script lang="ts" setup>
import { ref, Ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useContext } from '@/composables/context'

interface Props {
  maxSize: {
    type: number
    default: 1
    required: true
  }
}

const { maxSize } = defineProps<Props>()
const ctx = useContext()
const { webSocketService } = ctx
const MAX_SIZE_FILE_IN_MB = 100

const isLoading = false
const uploadReady = true

const errors = []

function isFileSizeValid(fileSize: number) {
  if (fileSize <= MAX_SIZE_FILE_IN_MB) {
    console.log('File size is valid')
  } else {
    errors.push(`File size should be less than ${MAX_SIZE_FILE_IN_MB} MB`)
  }
}

function isFileValid(file: any) {
  isFileSizeValid(Math.round((file.size / 1024 / 1024) * 100) / 100)

  if (errors.length === 0) {
    return true
  } else {
    return false
  }
}

function handleFileChange(event: { target: { files: any[] } }) {
  debugger

  if (event.target.files && event.target.files[0]) {
    if (isFileValid(event.target.files[0])) {
      webSocketService.sendFile(event.target.files[0])
    } else {
      console.log('Invalid file')
    }
  }
}
</script>

<template>
  <BaseButton
    class="dashboard-files__button"
    theme="new-file"
    @change="handleFileChange"
  >
    <label for="selectFile">+ Add new file</label>
    <input
      id="selectFile"
      ref="newFile"
      type="file"
      class="selectFiles"
    />
  </BaseButton>
</template>

<style lang="scss" scoped>
input {
  display: none;
}
label {
  padding: 26px calc(100% - 170px)
}
</style>
