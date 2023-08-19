<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import ImageTrash from '@/assets/images/modal/ImageTrash.svg'
import ImageWarning from '@/assets/images/modal/ImageWarning.svg'
import ImageX from '@/assets/images/modal/x.svg'
import { useContext } from '@/composables/context'
import { computed } from 'vue'
import Theme from '@/types/Theme'

import { useI18n } from 'vue-i18n'
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
            Cancel
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
  background: rgba(12, 12, 12, 0.25);
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
    background: #FFFFFF;
    box-shadow: 0px 4px 24px rgba(92, 93, 126, 0.14);
    border-radius: 12px;
    padding: 24px;
    width: 546px;
    margin:12px;
  }

  &__header {
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
    margin: 24px 0;

    @include devices(mobile) {
      justify-content: center;
      font-size: 20px;
      flex-direction: column;
      text-align: center;
    }
    &-icon {
      margin-right: 12px;
      
      @include devices(mobile) {
        margin: 18px;
      }
    }
  }
  &__title {
    width:100%;
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
    opacity: 0.6;
    
    @include devices(mobile) {
      // margin: 16px;
      text-align: center;
    }
  }
  &__buttons {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
    margin: 32px 0 0 0;
      
    @include devices(mobile) {
      margin: 16px 0;
      align-items: center;
      justify-content: center;
    }
  }
  &__button {

    &-icon{
      margin-right:8px;
    }
    &-cancel {
      margin-right: 8px;
    }
  }
}
</style>
