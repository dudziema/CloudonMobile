<script lang="ts" setup>
import { ref, Ref } from 'vue'
import IconSearch from '@/assets/images/search/IconSearch.svg'
import ImageX from '@/assets/images/modal/x.svg'

const searchInput: Ref<string> = ref()
const emit = defineEmits<{
  (e: 'search', value: string): void
}>()

function search(searchFile: string) {
  emit('search', searchFile)
}

function clearSearchInput() {
  searchInput.value = ''
  search(searchInput.value)
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
    <IconSearch class="search-bar__img" />
    <ImageX
      class="search-bar__cancel"
      @click="clearSearchInput"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  width: 80%;

  &__input {
    border: 1px solid transparent;
    border-radius: 8px;
    width: 100%;
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
  &__cancel {
    position: absolute;
    right: 12px;
    top: 10px;
  }
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}
</style>
