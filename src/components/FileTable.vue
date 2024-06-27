<script lang="ts" setup>
import { ref, watch } from 'vue'

import ButtonSort from '@/assets/images/buttons/ButtonSort.svg'

import FileItem from '@/components/ui/FileItem.vue'

import type { File } from '@/types/File'
import type { SortDirections } from '@/types/search-and-filter/SortDirections'

const props = defineProps({
  files: {
    type: Array as () => File[],
    required: true
  },
  tableHeaders: {
    type: Array as () => { id: number, label: string; field: string, sortable: boolean }[],
    required: true
  },
  clearItems: {
    type: Boolean,
    required: true
  },
  closeWidgetClicked: {
    type: Boolean,
    required: true
  },
  sortDirections: {
    type: Object as () => SortDirections,
    required: true
  }

})

const itemsSelected = ref<File[]> ([])

const emit = defineEmits(['itemsSelected', 'sortTable'])

function isSelected(file: File, isSelected: boolean) {
  if (isSelected) {
    itemsSelected.value.push(file)
  } else {
    const index = itemsSelected.value.indexOf(file)

    if (index > -1) {
      itemsSelected.value.splice(index, 1)
    }
  }

  emit('itemsSelected', itemsSelected.value)
}

const allItemsButtonSelected = ref(false)

watch(props, newValue => {
  if (newValue.clearItems) {
    itemsSelected.value.length = 0
    emit('itemsSelected', itemsSelected.value)
  }

  if(newValue.closeWidgetClicked){
    allItemsButtonSelected.value = false
  }
})

function sortTable(headerName: string) {
  emit('sortTable', headerName)
}

function sortClass(headerLabel: string): string {
  const baseClass = 'file-table__sort'
  const ascClass = `${baseClass}--asc-${headerLabel}`
  const dscClass = `${baseClass}--dsc-${headerLabel}`
  
  return props.sortDirections[headerLabel] === 'asc' ? ascClass : dscClass
}

</script>

<template>
  <table class="file-table">
    <thead class="file-table__header">
      <tr class="file-table__header-line">
        <th class="file-table__line file-table__line-button-input">
          <input
            v-model="allItemsButtonSelected"
            type="checkbox"
          />
        </th>

        <th
          v-for="header in tableHeaders"
          :key="header.id"
          :class="['file-table__line', `file-table__line-${header.label}`]"
          data-testid="table-headers"
          @click="() => { if (header.sortable) sortTable(header.label) }"
        >
          {{ header.field }}

          <ButtonSort
            v-if="header.sortable"
            :class="sortClass(header.label)"
          />
        </th>
      </tr>
    </thead>

    <tbody class="file-table__body">
      <FileItem
        v-for="(file, index) in files"
        :key="index"
        :file="file"
        :all-items-button-selected="allItemsButtonSelected"
        :clear-items="clearItems"
        :close-widget-clicked="closeWidgetClicked"
        @is-selected="isSelected"
      />
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.file-table {
  position: relative;
  height: calc(100vh - 215px);
  overflow: auto;
  width: 100%;

  &__header {
    position: sticky;
    top: 0;
    background-color: $color-background-main;
    opacity: $opacity-none;
    z-index: 1;

    @include devices(mobile) {
      display: none;
    }

    &-line {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      align-content: center;
      flex-wrap: nowrap;
      margin: calc($spacing-vertical-small + ($spacing-vertical-small / 2)) 0;
      padding-right: calc($spacing-horizontal-small * 3);
    }
  }

  &__line {
    font-weight: $font-weight-semi-bold;
    color: $color-text-default;
    text-transform: uppercase;

    input[type="checkbox"] {
      width: 16px;
      height: 16px;

      border: $border-default;
      border-radius: calc($radius-small / 2);
      margin: calc($spacing-horizontal-small + ($spacing-horizontal-small / 2));
    }

    input[type="checkbox"]:checked {
      border: $border-primary !important;
    }

    &-button {
      width: 40px;

      @include devices(tablet) {
        display: none !important;
      }

      &-more {
        width: 20px;

        @include devices(only-desktop) {
          display: none !important;
        }
      }
    }

    &-name {
      text-overflow: ellipsis;
      flex: 1;
      cursor: pointer;
      margin-left: -29px;

      @include devices(mobile) {
        width: $widthColumnNameMobile;
      }

      @include devices(tablet-min) {
        width: $widthColumnNameTabletMin;
      }

      @include devices(tablet) {
        max-width: $widthColumnNameTablet;
      }

      @include devices(desktop-small) {
        max-width: $widthColumnNameDesktop;
      }
    }

    &-image {
      width: 40px;
    }
      &-time {
        width: 174px
    }

    &-size {
      width: 100px;
      
      @include devices(tablet-min) {
        display: none;
      }
    }

    &-time {
      cursor: pointer;
    }
  }

  &__sort {
    &--asc-name, &--asc-time {
      transition: 0.5s ease-in;
    }

    &--dsc-name, &--dsc-time {
      rotate: -180deg;
      transition: 0.5s ease-in-out;
    }
  }
}
</style>
