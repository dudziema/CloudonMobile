<script lang="ts" setup>
import ImageFiles from '@/assets/images/buttons/ImageFiles.svg'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useContext } from '@/composables/context'

const ctx = useContext()
const { webSocketService } = ctx

function onDrop(event: DragEvent) {
  if(event.dataTransfer) {
    const items = event.dataTransfer.items
    let index = items.length - 1

    while(index > -1) {
      if(items[index].kind === 'file') {
        const file: globalThis.File | null = items[index].getAsFile()

        if(file) {
          webSocketService.sendFile(file)
        }
      } else {
        alert('This item can not be uploaded.')
      }
      index--
    }
  }
}
</script>

<template>
  <div
    data-testid="dashboard-no-files"
    class="dashboard-files__files dashboard-files__files--empty"
    @dragover.prevent
    @dragenter.prevent
    @dragleave.prevent="onDrop"
    @drop.prevent="onDrop"
  >
    <ImageFiles />
    <p>There are no items here!</p>
    <p>Drag & drop your file here to start uploading</p>
    <p>- or -</p>
    <BaseButton theme="active">
      Browse Files
    </BaseButton>
  </div>
</template>
