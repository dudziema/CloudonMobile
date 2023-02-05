<script lang="ts" setup>
import { defineProps } from 'vue'
import Theme from '@/types/Theme'

interface Props {
  theme: Theme
}

const { theme } = defineProps<Props>()
</script>

<template>
  <button
    :class="`base-button base-button--${theme}`"
    :disabled="theme === Theme.INACTIVE ? true : false"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  height: 56px;
  border-radius: 12px;
  color: $color-text-buttons;

  &--active {
    background-color: $color-background-special;
  }

  &--inactive {
    background-color: $color-background-inactive;
  }

  &--new-file {
    background-color: $color-background-special;
    padding: 0px;
  }
  &--modal-action {
    background-color: $color-background-error;
  }

  &--modal-simply {
    background-color: transparent;
    color: $color-background-special;
  }

  &--simply {
    background-color: transparent;
    color: $color-text-default;
    padding: 0;
    justify-content: flex-start;
  }

  &--special {
    background-color: $color-background-divider;
    color: $color-text-dark;
    font-weight: $font-weight-thin;
  }
}
</style>
