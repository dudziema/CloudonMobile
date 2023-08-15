<script setup lang="ts">
import ImageX from '@/assets/images/modal/x.svg'
import LeftMenu from '@/components/LeftMenu.vue'

defineProps<{
  isBurgerMenuOpen: boolean,
  isAllFilesBtnActive: boolean,
  isRecentFilesBtnActive: boolean
}>()

const emit = defineEmits(['closeBurgerMenu', 'allFiles', 'sortRecentFiles'])
</script>

<template>
  <Transition name="slide">
    <div
      v-if="isBurgerMenuOpen"
      class="burger-menu"
    >
      <button
        class="burger-menu__close"
        @click="emit('closeBurgerMenu')"
      >
        <ImageX />
      </button>

      <LeftMenu
        :is-all-files-btn-active="isAllFilesBtnActive"
        :is-recent-files-btn-active="isRecentFilesBtnActive"
        @all-files="emit('allFiles')"
        @sort-recent-files="emit('sortRecentFiles')"
      />
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.burger-menu {
  position: relative;
  background: $color-basic;
  box-shadow: 0px 4px 24px 0px rgba(92, 93, 126, 0.14);
  width: 240px;
  height: 100%;
  z-index: 1;

  &__close {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
