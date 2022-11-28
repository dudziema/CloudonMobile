<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import FileItem from '@/components/ui/FileItem.vue'
import { useContext } from '@/composables/context'
import File from '@/types/File'

interface Props {
  files: File[]
  tableHeaders: { label: string; field: string }[]
}

const { files, tableHeaders } = defineProps<Props>()

const ctx = useContext()
const { webSocketService } = ctx
</script>

<template>
  <table class="file-table">
    <thead class="file-table__header">
      <tr class="file-table__header-line">
        <th
          v-for="(column, index) in tableHeaders"
          :key="index"
          :class="`file-table__line file-table__line-${column.label}`"
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
</style>
