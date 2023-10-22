<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import IconSearch from '@/assets/images/search/IconSearch.svg'
import ImageX from '@/assets/images/modal/x.svg'

import BaseChips from '@/components/ui/BaseChips.vue'

import Chips from '@/types/Chips'

const { t } = useI18n()
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

const chipsList= ref<Chips[]>([
  { chipsName: t('dashboard.pictures'), isClicked: false },
  { chipsName: t('dashboard.files'), isClicked: false  },
  { chipsName: t('dashboard.videos'), isClicked: false  },
  { chipsName: t('dashboard.soundFiles'), isClicked: false  },
])

function selectChipsClicked(chipsName: string) {
  const chips = chipsList.value.find(chips => chips.chipsName === chipsName)

  if(chips) {
    chips.isClicked = !chips.isClicked
    emit('search', searchInput.value, chipsList.value)
  }
}

function clearChipsSelection() {
  chipsList.value.forEach(chips => {
    chips.isClicked = false
  })
}
</script>

<template>
  <div class="search-bar">
    <div class="search-bar__input">
      <input
        v-model="searchInput"
        type="search"
        class="search-bar__input-field"
        :placeholder="t('dashboard.search')"
        @keyup.prevent="search(searchInput, chipsList)"
      />

      <IconSearch class="search-bar__img" />

      <ImageX
        v-if="searchInput"
        class="search-bar__cancel"
        @click="clearSearchInput"
      />
    </div>

    <div class="search-bar__chips">
      <BaseChips
        :chips-list="chipsList"
        @select-chips-clicked="selectChipsClicked"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  width: calc(100vw - 74px);

  &__input {
    position: relative;
    max-width: 750px;

    &-field {
    width: 100%;
    border: $border-none;
    border-radius: $radius-small;
    padding: $spacing-vertical-small calc(4 * $spacing-horizontal-default);
    margin-bottom: calc($spacing-vertical-small + ($spacing-vertical-small / 2));
    background: transparent;

      &:hover, &:focus {
        border: $border-dark;
      }

      &::placeholder {
        opacity: $opacity-medium;
      }

      &:focus::placeholder {
        opacity: $opacity-max;
      }

      &:focus ~ .search-bar__img {
        opacity: $opacity-none;
        filter: invert(18%) sepia(83%) saturate(3323%) hue-rotate(203deg) brightness(95%) contrast(108%);
      }
    }
  }
  &__img {
    position: absolute;
    left: 8px;
    top: 8px;
    opacity: $opacity-medium;
  }

  &__cancel {
    position: absolute;
    right: 12px;
    top: 10px;
  }

  &__chips {
    display: flex;
    flex-direction: row;
    overflow: auto;
    padding-bottom: calc($spacing-vertical-small + ($spacing-vertical-small / 2));
  }
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}
</style>
