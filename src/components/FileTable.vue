<script lang="ts" setup>
import FileItem from '@/components/ui/FileItem.vue'
import File from '@/types/File'

interface Props {
  files: File[]
  tableHeaders: { label: string; field: string }[]
}

const { files, tableHeaders } = defineProps<Props>()
</script>

<template>
  <table class="file-table">
    <thead class="file-table__header">
      <tr class="file-table__header-line">
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
        v-for="(file, index) in files"
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
}
</style>
