<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'
import ImageTrashSmall from '@/assets/images/modal/ImageTrashSmall.svg'
import ImageDownload from '@/assets/images/modal/ImageDownload.svg'
import ImageX from '@/assets/images/modal/x.svg'
import Theme from '@/types/Theme'

interface Props {
  quantityItemsSelected: number
}

const { quantityItemsSelected } = defineProps<Props>()

const emit = defineEmits(['download', 'delete', 'closeWidget'])

const { t } = useI18n()

const widgetText = computed(()=> {
  return quantityItemsSelected > 4 ? t('dashboard.filesMoreThan10')
    : quantityItemsSelected > 1 ? t('dashboard.files')
      : t('dashboard.file')
})
</script>

<template>
  <div class="widget">
    <p class="widget__counter">
      <span class="widget__counter-number">{{ quantityItemsSelected }}</span>
      
      <span class="widget__counter-text">
        {{ widgetText }}
        
        {{ $t('dashboard.selectedFiles') }}
      </span>
    </p>

    <div class="widget__buttons">
      <BaseButton
        class="widget__button"
        :theme="Theme.SPECIAL"
        @click="emit('download')"
      >
        <ImageDownload class="widget__button-image" />
        
        {{ $t('dashboard.download') }}
      </BaseButton>
      
      <BaseButton
        class="widget__button"
        :theme="Theme.MODAL_ACTION"
        @click="emit('delete')"
      >
        <ImageTrashSmall class="widget__button-image" />
        
        {{ $t('dashboard.delete') }}
      </BaseButton>
      
      <button class="widget__button-close">
        <ImageX
          class="widget__close"
          @click="emit('closeWidget')"
        />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.widget {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  position: absolute;
  height: 66px;
  bottom: 0;
  left: 60px;
  right: 60px;
  background: $color-background-widget;
  -webkit-backdrop-filter: blur(3.61119px);
  backdrop-filter: blur(3.61119px);
  border-radius: $radius-default;
  padding: $spacing-horizontal-big;
  margin-bottom: calc($spacing-horizontal-small + ($spacing-horizontal-small / 2));

  &__counter {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: center;
    color: $color-text-buttons;

    &-number {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: calc($spacing-vertical-small / 2) $spacing-horizontal-small;
      gap: $gap-big;
      width: 30px;
      height: 32px;
      background: $color-background-widget10;
      border-radius: $radius-small;
    }

    &-text {
      display: flex;
      align-items: center;
      margin: $spacing-vertical-default;
      letter-spacing: 0.003em;
      color: $color-text-buttons;
    }
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__button {
    font-size: $font-size-small;
    height: 36px;
    margin: calc($spacing-horizontal-small + ($spacing-horizontal-small / 2));

    &-close {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      flex-direction: row;
    }

    &-image {
      margin: calc($spacing-horizontal-small / 2);
    }
  }

  &__close {
    filter: invert(100%) sepia(0%) saturate(7486%) hue-rotate(351deg) brightness(114%) contrast(103%)
  }
}
</style>
