<script lang="ts" setup>
import { ref, defineProps } from 'vue'
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
</script>

<template>
  <div class="widget">
    <p class="widget__counter">
      <span class="widget__counter-number">{{ quantityItemsSelected }}</span>
      
      <span class="widget__counter-text">files selected</span>
    </p>

    <div class="widget__buttons">
      <BaseButton
        class="widget__button"
        :theme="Theme.SPECIAL"
        @click="emit('download')"
      >
        <ImageDownload class="widget__button-image" />
        
        Download
      </BaseButton>
      
      <BaseButton
        class="widget__button"
        :theme="Theme.MODAL_ACTION"
        @click="emit('delete')"
      >
        <ImageTrashSmall class="widget__button-image" />
        
        Delete
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
  position: absolute;
  height: 66px;
  bottom: 0;
  left: 60px;
  right: 60px;
  background: rgba(3, 14, 29, 0.7);
  -webkit-backdrop-filter: blur(3.61119px);
  backdrop-filter: blur(3.61119px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  padding: 15px;

  &__counter {
    color: white;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: center;

    &-number {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 4px 8px;
      gap: 10px;
      width: 30px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
    }

    &-text {
      margin: 16px;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      letter-spacing: 0.003em;
      color: #FFFFFF;
    }
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__button {
    font-size: 14px;
    line-height: 24px;
    height: 36px;
    margin: 12px;

    &-close {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      flex-direction: row;
    }

    &-image {
      margin:4px;
    }
  }

  &__close {
    filter: invert(100%) sepia(0%) saturate(7486%) hue-rotate(351deg) brightness(114%) contrast(103%)
  }
}
</style>
