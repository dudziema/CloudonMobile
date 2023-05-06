<script lang="ts" setup>
import { iconForExtentionDictionary } from '@/utils/extentionsDictionary'
import Chips from '@/types/Chips'

interface Props {
  chipsList: Chips[]
}

const { chipsList } = defineProps<Props>()

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
    :key="chips.name"
    :class="chips.clicked ? 'base-chips base-chips--active' :'base-chips'"
    @click="selectChipsClicked(chips.name)"
  >
    <component
      :is="iconForExtentionDictionary[chips.name]"
      class="base-chips__icon"
    />
    <p
      :class="chips.clicked ? 'base-chips__name base-chips__name--active' : 'base-chips__name'"
    >
      {{ chips.name }}
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
  margin: $spacing-vertical-small $spacing-horizontal-small;
  cursor: pointer;

  &__name {
    opacity: 0.6;

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
