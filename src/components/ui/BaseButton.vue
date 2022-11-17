<script lang="ts" setup>
import { defineProps } from 'vue'
interface Props {
  theme: string
}
const { theme = 'active' } = defineProps<Props>()
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
  width: 100%;
  height: 56px;
  border-radius: 12px;
  margin-top: 56px;
  color: $color-text-buttons;

  &--active {
    background-color: $color-background-special;
  }

  &--inactive {
    background-color: $color-background-inactive;
  }
}
</style>
