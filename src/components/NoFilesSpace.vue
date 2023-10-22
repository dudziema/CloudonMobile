<script lang="ts" setup>
import ImageFiles from '@/assets/images/buttons/ImageFiles.svg'

import BaseUpload from '@/components/ui/BaseUpload.vue'

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
    class="no-files-space"
    @dragover.prevent
    @dragenter.prevent
    @dragleave.prevent="onDrop"
    @drop.prevent="onDrop"
  >
    <ImageFiles />

    <h1>{{ $t('dashboard.noItemsHere') }}</h1>

    <p class="no-files-space__text">
      {{ $t('dashboard.dragAndDrop') }}
    </p>

    <p class="no-files-space__text">
      {{ $t('dashboard.or') }}
    </p>

    <BaseUpload
      label="Browse Files"
      class="no-files-space__button-new-file"
    />
  </div>
</template>

<style lang="scss" scoped>
.no-files-space {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  width: 100%;
  grid-column-start: 3;
  grid-column-end: 11;
  grid-row-start: 2;
  grid-row-end: 9;
  border: $border-dashed;
  border-radius: $radius-small;
  gap: calc( 2 * $gap-default);

  &__text {
    opacity: $opacity-default;
    display: none;

    @include devices(only-desktop) {
      display: block;
    }
  }

  &__button-new-file {
    min-width: 132px;
  }
}

</style>
