<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'

import ImageTrash from '@/assets/images/modal/ImageTrash.svg'
import ImageWarning from '@/assets/images/modal/ImageWarning.svg'
import ImageX from '@/assets/images/modal/x.svg'

import { useContext } from '@/composables/context'

import Theme from '@/types/Theme'

const { t } = useI18n()
const ctx = useContext()
const { modalService } = ctx
const { modalConfig } = modalService

const isVisible = computed(() => modalService.isVisible.value)

function closeModal() {
  modalService.close()
}

</script>

<template>
  <Transition name="modal">
    <div
      v-if="isVisible"
      class="modal"
    >
      <div class="modal__content">
        <div class="modal__title">
          <p class="modal__header">
            <ImageWarning class="modal__header-icon" />

            {{ modalConfig.title }}
          </p>
          
          <button
            class="modal__close"
            @click="closeModal()"
          >
            <ImageX />
          </button>
        </div>

        <p class="modal__description">
          {{ modalConfig.description }}
        </p>

        <div class="modal__buttons">
          <BaseButton
            v-if="modalConfig.isCancel"
            class="modal__button-cancel"
            :theme="Theme.MODAL_SIMPLY"
            @click="closeModal()"
          >
            {{ $t('dashboard.cancel') }}
          </BaseButton>
          
          <BaseButton
            :theme="Theme.MODAL_ACTION"
            @click="modalConfig.buttonAction.callback()"
          >
            <ImageTrash
              v-if="modalConfig.buttonAction.text === t('dashboard.delete')"
              class="modal__button-icon"
            />

            {{ modalConfig.buttonAction.text }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: $color-background-primary10;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  z-index: 2;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    background: $color-background-main;
    box-shadow: $box-shadow-default;
    border-radius: $radius-default;
    padding: calc(3 * $spacing-horizontal-small);
    width: 546px;
    margin: calc($spacing-horizontal-small + ($spacing-horizontal-small / 2));
  }

  &__header {
    display: flex;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    flex-direction: row;
    font-weight: $font-weight-semi-bold;
    font-size: $font-size-title-sm;
    line-height: $line-height-medium;
    letter-spacing: -0.3px;
    width: 100%;
    margin: calc(3 * $spacing-vertical-small) 0;

    @include devices(mobile) {
      justify-content: center;
      flex-direction: column;
      text-align: center;
      font-size: $font-size-base;
    }

    &-icon {
      margin-right: calc($spacing-horizontal-small + ($spacing-horizontal-small / 2));
      
      @include devices(mobile) {
        margin: $spacing-vertical-default;
      }
    }
  }

  &__title {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  &__close {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: sticky;
    top: 18px;
    left: calc(100% - 36px);
    z-index: 1;
  }

  &__description {
    opacity: $opacity-default;
    
    @include devices(mobile) {
      text-align: center;
    }
  }

  &__buttons {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
    margin: calc($spacing-vertical-default * 2) 0 0 0;
      
    @include devices(mobile) {
      margin: $spacing-vertical-default 0;
      align-items: center;
      justify-content: center;
    }
  }

  &__button {

    &-icon{
      margin-right: $spacing-horizontal-small;
    }
    
    &-cancel {
      margin-right: $spacing-horizontal-small;
    }
  }
}
</style>
