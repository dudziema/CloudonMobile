<script lang="ts" setup>
import FileItem from '@/components/ui/FileItem.vue'
import File from '@/types/File'
import { ref, Ref } from 'vue'

interface Props {
  files: File[]
  tableHeaders: { label: string; field: string }[]
}

const { files, tableHeaders } = defineProps<Props>()

const itemsSelected: Ref<File[]> = ref([])

function isSelected(file: File, isSelected: boolean) {
  if(isSelected) {
    itemsSelected.value.push(file)
  } else if (!isSelected) {
    const index = itemsSelected.value.indexOf(file)

    if (index > -1) {
      itemsSelected.value.splice(index, 1)
    }
  }
}

const allItemsButtonSelected = ref(false)
</script>

<template>
  <table class="file-table">
    <thead class="file-table__header">
      <tr class="file-table__header-line">
        <th class="file-table__line file-table__line-button">
          <input
            v-model="allItemsButtonSelected"
            type="checkbox"
          />
        </th>

        <th
          v-for="(column, index) in tableHeaders"
          :key="index"
          :class="`file-table__line file-table__line-${column.label}`"
          data-testid="table-headers"
        >
          {{ column.field }}
        </th>
      </tr>
    </thead>

    <tbody>
      <FileItem
        v-for="(file, index) in files"
        :key="index"
        :file="file"
        :all-items-selected="allItemsButtonSelected"
        @is-selected="isSelected"
      />
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.file-table {
  width:100%;
  &__header-line {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    align-content: center;
    flex-wrap: nowrap;
  }
  &__line {
    margin-right: 20px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.005em;
    text-transform: uppercase;
    color: #0C0C0C;
    opacity: 0.6;
    &-button {
      width:5%;
    }
    &-name {
      width: 50%;
    }

    &-image {
      width:5%;
    }
      &-time{
      width: 15%;
    }

    &-size{
      width: 15%;
    }
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
