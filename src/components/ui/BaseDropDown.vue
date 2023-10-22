<template>
  <div class="base-drop-down">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.base-drop-down {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 180px;
  padding: $spacing-horizontal-small;
  border-radius: $radius-default;
  background: $color-background-main;
  transform:  translate(-165px, 2px);
  box-shadow: $box-shadow-default;
  position: absolute;
  z-index: 1;
}
</style>
