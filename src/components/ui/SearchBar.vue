<script lang="ts" setup>
import { ref, Ref, shallowRef } from 'vue'
import IconSearch from '@/assets/images/search/IconSearch.svg'
import ImageX from '@/assets/images/modal/x.svg'
import BaseChips from '@/components/ui/BaseChips.vue'
import Chips from '@/types/Chips'

const searchInput: Ref<string> = ref('')
const emit = defineEmits<{
  (e: 'search', input: string, chipsList: Chips[]): void
  (e: 'clearSearch'): void
}>()

function search(searchFile: string, chipsList: Chips[]) {
  emit('search', searchFile, chipsList)

  if(!searchFile) {
    clearSearchInput()
  }
}

function clearSearchInput() {
  searchInput.value = ''
  emit('clearSearch')
  clearChipsSelection()
}

const chipsList: Ref<Chips[]> = ref([
  { name:'Pictures', clicked: false },
  { name: 'Files', clicked: false  },
  { name: 'Videos', clicked: false  },
  { name: 'Sound files', clicked: false  },
])

function selectChipsClicked(chipsName: string) {
  const chips = chipsList.value.find(chips => chips.name === chipsName)

  if(chips) {
    chips.clicked = !chips.clicked
    emit('search', searchInput.value, chipsList.value)
  }
}

function clearChipsSelection() {
  chipsList.value.forEach(chips => {
    chips.clicked = false
  })
}
</script>

<template>
  <div class="search-bar">
    <input
      v-model="searchInput"
      type="search"
      class="search-bar__input"
      placeholder="Search for anything"
      @keyup.prevent="search(searchInput, chipsList)"
      @click="isSearchBarClicked=true"
    />
    <IconSearch class="search-bar__img" />
    <ImageX
      v-if="searchInput"
      class="search-bar__cancel"
      @click="clearSearchInput"
    />

    <div class="search-bar__chips">
      <BaseChips
        :chips-list="chipsList"
        @selectChipsClicked="selectChipsClicked"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  width: 80%;
  display: flex;
  flex-direction: column;;

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
  &__chips {
    display: flex;
    flex-direction: row;
  }
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}
</style>
