<script lang="ts" setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import { useContext } from '@/composables/context'
import File from '@/types/File'
import Theme from '@/types/Theme'

interface Props {
  label: string
}

const { label } = defineProps<Props>()

const KB = 1024
const MB = 1024 * KB
const MAX_SIZE_FILE_IN_BYTES = 100 * MB

function isFileValid(file: File) {
  return file.size < MAX_SIZE_FILE_IN_BYTES ? true : false
}

const ctx = useContext()
const { webSocketService } = ctx

function addNewFile(event: { target: { files: File[] } }) {
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
    class="base-upload__button"
    :theme="Theme.NEW_FILE"
    @change="addNewFile"
  >
    <label
      for="selectFile"
      class="base-upload__label"
    >
      {{ label }}
    </label>

    <input
      id="selectFile"
      ref="newFile"
      type="file"
      class="base-upload__input-select-file"
    />
  </BaseButton>
</template>

<style lang="scss" scoped>
.base-upload {
  &__button {
    margin: $spacing-vertical-small $spacing-horizontal-default;
  }

  &__label {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    flex-direction: column;
  }

  &__input-select-file {
    display: none;
  }
}
</style>
