<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import ImageTrash from '@/assets/images/modal/ImageTrash.svg'
import ImageWarning from '@/assets/images/modal/ImageWarning.svg'
import { useContext } from '@/composables/context'
import { computed } from 'vue'

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
            <ImageWarning class="modal__header-icon"/>
            {{ modalConfig.title }}
          </p>
        </div>
        <p class="modal__description">{{ modalConfig.description}}</p>
        <div class="modal__buttons">
          <BaseButton
            class="modal__button-cancel"
            theme="simply"
            @click="closeModal()"
          >
            Cancel
          </BaseButton>
          
          <BaseButton theme="modal-action">
            <ImageTrash
              v-if="modalConfig.actionButtonName === 'Delete'"
              class="modal__button-icon"
            />
            {{ modalConfig.actionButtonName }}
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
    height: 256px;
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
    &-icon {
      margin-right: 12px;
    }
  }
  &__title {

  }
  &__description {
    opacity: 0.6;
  }
  &__buttons {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
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
