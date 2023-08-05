<template>
  <div class="base-drop-down">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.base-drop-down {
  display: flex;
  min-width: 180px;
  padding: 8px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 12px;
  background: var(--white, #FFF);
  transform:  translate(-165px, 2px);

  /* menuShadow */
  box-shadow: 0px 4px 24px 0px rgba(92, 93, 126, 0.14);

  position: absolute;
  z-index: 1;
}
</style>
