<script lang="ts" setup>
import { ref } from 'vue'
import IconSearch from '@/assets/images/search/IconSearch.svg'

const searchInput: string = ref()
const emit = defineEmits<{
  (e: 'search', value: string): void
}>()

function search(searchFile: string) {
  emit('search', searchFile)
}
</script>

<template>
  <div class="search-bar">
    <input
      v-model="searchInput"
      type="search"
      class="search-bar__input"
      placeholder="Search for anything"
      @keyup.prevent="search(searchInput)"
    />
    <IconSearch class="search-bar__img"/>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  position: relative;

  &__input {
    border: 1px solid transparent;
    border-radius: 8px;
    width: 80%;
    padding: 9px 4px 9px 40px;
    background: transparent;

    &::placeholder {
      opacity: 0.4;
    }

    &:focus::placeholder {
      opacity: 0;
    }

    &:focus ~ .search-bar__img {
      opacity: 1;
      filter: invert(18%) sepia(83%) saturate(3323%) hue-rotate(203deg) brightness(95%) contrast(108%);
    }
  }
  &__img {
    position: absolute;
    left: 8px;
    top: 10px;
    opacity: 0.4;
  }
}
</style>
