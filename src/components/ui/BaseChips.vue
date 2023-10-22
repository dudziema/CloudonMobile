<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { iconForExtensionDictionary } from '@/utils/extensionsDictionary'

import Chips from '@/types/Chips'

defineProps<{
  chipsList:Chips[]
}>()

const { t } = useI18n()
const icons = ref(iconForExtensionDictionary(t))
const emit = defineEmits<{
  (e: 'selectChipsClicked', chipsName: string): void
}>()

function selectChipsClicked(chipsName: string) {
  emit('selectChipsClicked', chipsName)
}
</script>

<template>
  <div
    v-for="chips in chipsList"
    :key="chips.chipsName"
    :class="['base-chips', {'base-chips--active' : chips.isClicked }, {'base-chips--inactive' : !chips.isClicked }]"
    @click="selectChipsClicked(chips.chipsName)"
  >
    <component
      :is="icons[chips.chipsName]"
      class="base-chips__icon"
    />

    <p :class="['base-chips__name ', { 'base-chips__name--active': chips.isClicked }]">
      {{ chips.chipsName }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.base-chips {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: $border-default;
  border-radius: $radius-default;
  height: 40px;
  padding-right: calc($spacing-horizontal-small * 2);
  margin-right: calc($spacing-horizontal-small * 2);
  cursor: pointer;
  gap: $gap-small;
  white-space: nowrap;

  &__name {
    opacity: $opacity-default;
    text-transform: capitalize;

    &--active {
      color: $color-text-dark;
      opacity: $opacity-none;
    }
  }

  &--active {
    border: $border-dark;
  }
}
</style>
