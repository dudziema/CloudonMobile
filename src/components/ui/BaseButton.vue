<script lang="ts" setup>
import { defineProps } from 'vue'

interface Props {
  theme: string
}

const { theme } = defineProps<Props>()
</script>

<template>
  <button :class="`base-button base-button--${theme}`">
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
}
</style>
