<script lang="ts" setup>
import FileItem from '@/components/ui/FileItem.vue'
import File from '@/types/File'
import { ref, Ref, watch } from 'vue'

const props = defineProps<{
  files: File[]
  tableHeaders: { label: string; field: string }[],
  clearItems: boolean,
  closeWidgetClicked: boolean
}>()

const itemsSelected: Ref<File[]> = ref([])

const emit = defineEmits(['itemsSelected'])

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

const allItemsButtonSelected: Ref<boolean>= ref(false)

watch(props, newValue => {
  if (newValue.clearItems) {
    itemsSelected.value.length = 0
    emit('itemsSelected', itemsSelected.value)
  }

  if(newValue.closeWidgetClicked){
    allItemsButtonSelected.value = false
  }
})
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

    <tbody class="file-table__body">
      <FileItem
        v-for="file in files"
        :key="file.name"
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
  $self: &;
  width: 100%;

  &__header-line {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    flex-wrap: nowrap;
    margin: 12px 0;
    padding-right: 24px;
  }
  &__line {
    font-weight: $font-weight-semi-bold;
    letter-spacing: 0.005em;
    text-transform: uppercase;
    color: $color-text-default;

    &:not(&-button) {
      opacity: 0.6;
    }

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      opacity: 0.2 !important;
      border: 1px solid $color-border-primary;
      border-radius: 4px;
      margin: 12px;
    }

    input[type="checkbox"]:checked {
      opacity: 1 !important;
    }

    &-button {
      width: 5%;
    }
    &-name {
      width: 50%;
      text-overflow: ellipsis;
    }

    &-image {
      width: 5%;
    }
      &-time {
      width: 15%;
    }

    &-size {
      width: 15%;
    }
  }
  #{ $self }, #{ $self }__body {
   overflow: auto;
   height: 80vh;
  }
}
</style>
