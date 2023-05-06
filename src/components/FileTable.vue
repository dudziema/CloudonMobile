<script lang="ts" setup>
import { computed, Ref, ref } from 'vue'
import ButtonSort from '@/assets/images/buttons/ButtonSort.svg'
import FileItem from '@/components/ui/FileItem.vue'
import File from '@/types/File'

interface Props {
  files: File[]
  tableHeaders: { id: number, label: string; field: string, sortable: boolean }[]
}

const { files, tableHeaders } = defineProps<Props>()

const ASC = 'asc'
const DSC = 'dsc'

const filesSorted: Ref<File[]> = ref(files)
const sortDirections: Ref<{ [key: string]: string }> = ref({'name': ASC, 'time': ASC })

function sortName() {
  sortDirections.value.name = sortDirections.value.name  === ASC ? DSC : ASC

  filesSorted.value.sort((a: File, b: File) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()

    if (sortDirections.value.name === ASC) {
      return nameA.localeCompare(nameB )
    } else {
      return nameB.localeCompare(nameA)
    }
  })
}

function sortByEpochDate() {
  sortDirections.value.time = sortDirections.value.time  === ASC ? DSC : ASC
  
  filesSorted.value.sort((a: File, b: File) => {
    const dateA = a.date_epoch
    const dateB = b.date_epoch

    if (sortDirections.value.time === ASC) {
      return dateA - dateB
    } else {
      return dateB - dateA
    }
  })
}

function sortTable(headerName: string) {
  if (headerName === 'name') sortName()
  if (headerName === 'time') sortByEpochDate()
}

function sortClass(headerLabel: string): string {
  const baseClass = 'file-table__sort'
  const ascClass = `${baseClass}--asc-${headerLabel}`
  const dscClass = `${baseClass}--dsc-${headerLabel}`
  
  return sortDirections.value[headerLabel] === ASC ? ascClass : dscClass
}

</script>

<template>
  <table class="file-table">
    <thead class="file-table__header">
      <tr class="file-table__header-line">
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
        v-for="(file, index) in filesSorted"
        :key="index"
        :file="file"
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
    opacity: 0.6;

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
