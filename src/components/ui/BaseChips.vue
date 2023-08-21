<script lang="ts" setup>
import {ref, watchEffect} from 'vue'
import { iconForExtentionDictionary } from '@/utils/extentionsDictionary'
import Chips from '@/types/Chips'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps<{
  chipsList:Chips[]
}>()

const emit = defineEmits<{
  (e: 'selectChipsClicked', chipsName: string): void
}>()

function selectChipsClicked(chipsName: string) {
  emit('selectChipsClicked', chipsName)
}

const icons = ref(iconForExtentionDictionary(t))
</script>

<template>
  <div
    v-for="chips in chipsList"
    :key="chips.chipsName"
    :class="chips.isClicked ? 'base-chips base-chips--active' :'base-chips  base-chips--inactive'"
    @click="selectChipsClicked(chips.chipsName)"
  >
    <component
      :is="icons[chips.chipsName]"
      class="base-chips__icon"
    />
    <p :class="chips.isClicked ? 'base-chips__name base-chips__name--active' : 'base-chips__name'">
      {{ chips.chipsName }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.base-chips {
  border: 1px solid rgba(12, 12, 12, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: calc($spacing-horizontal-small * 2);
  height: 40px;
  margin-right: calc($spacing-horizontal-small * 2);
  cursor: pointer;
  gap: 4px;
  white-space: nowrap;

  &__name {
    opacity: 0.6;
    text-transform: capitalize;

    &--active {
      color: $color-text-dark;
      opacity: 1;
    }
  }

  &--active {
    border: 1px solid $color-border-default;
  }
}
</style>
