<script lang="ts" setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import { useContext } from '@/composables/context'
import File from '@/types/File'

const ctx = useContext()
const { webSocketService } = ctx
const MAX_SIZE_FILE_IN_BYTES = 104857600

function isFileValid(file: File) {
  return file.size < MAX_SIZE_FILE_IN_BYTES ? true : false
}

function handleFileChange(event: { target: { files: File[] } }) {

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
