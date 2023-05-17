<script lang="ts" setup>
import { computed, Ref, ref, watch } from 'vue'
import ButtonSort from '@/assets/images/buttons/ButtonSort.svg'
import FileItem from '@/components/ui/FileItem.vue'
import File from '@/types/File'

const props = defineProps<{
  files: File[]
  tableHeaders: { id: number, label: string; field: string, sortable: boolean }[],
  clearItems: boolean,
  closeWidgetClicked: boolean,
  sortDirections: { [key: string]: string }
}>()

const itemsSelected: Ref<File[]> = ref([])

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

// const ASC = 'asc'
// const DSC = 'dsc'

// const filesSorted: Ref<File[]> = ref(props.files)
// const sortDirections: Ref<{ [key: string]: string }> = ref({'name': ASC, 'time': ASC })

// function sortName() {
//   sortDirections.value.name = sortDirections.value.name  === ASC ? DSC : ASC

//   filesSorted.value.sort((a: File, b: File) => {
//     const nameA = a.name.toUpperCase()
//     const nameB = b.name.toUpperCase()

//     if (sortDirections.value.name === ASC) {
//       return nameA.localeCompare(nameB )
//     } else {
//       return nameB.localeCompare(nameA)
//     }
//   })
// }

// function sortByEpochDate() {
//   sortDirections.value.time = sortDirections.value.time  === ASC ? DSC : ASC
  
//   filesSorted.value.sort((a: File, b: File) => {
//     const dateA = a.date_epoch
//     const dateB = b.date_epoch

//     if (sortDirections.value.time === ASC) {
//       return dateA - dateB
//     } else {
//       return dateB - dateA
//     }
//   })
// }

function sortTable(headerName: string) {
  emit('sortTable', headerName)
// if (headerName === 'name') sortName()
// if (headerName === 'time') sortByEpochDate()
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
        <th class="file-table__line file-table__line-button">
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
