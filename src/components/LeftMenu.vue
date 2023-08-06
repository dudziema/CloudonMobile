<script setup lang="ts">
import { useContext } from '@/composables/context'
import { useRouter } from 'vue-router'

import Theme from '@/types/Theme'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseUpload from '@/components/ui/BaseUpload.vue'

import ImageLogo from '@/assets/images/buttons/ImageLogo.svg'
import ImageLogOut from '@/assets/images/buttons/ImageLogOut.svg'
import ButtonAllFiles from '@/assets/images/buttons/ButtonAllFiles.svg'
import ButtonRecentFiles from '@/assets/images/buttons/ButtonRecentFiles.svg'

defineProps<{
  isAllFilesBtnActive: boolean,
  isRecentFilesBtnActive: boolean,
}>()

const emit = defineEmits(['allFiles', 'sortRecentFiles'])

const router = useRouter()
const ctx = useContext()
const { webSocketService, modalService } = ctx

function disconnect() {
  modalService.open({
    title: 'Disconnect account',
    description: 'Are you sure you want to proceed?',
    buttonAction: {
      text: 'Disconnect',
      callback: () => {
        webSocketService.disconnect()
        modalService.close()
        router.push('/')
      },
    },
  })
}

</script>

<template>
  <div class="left-menu">
    <div class="left-menu__upper">
      <p class="left-menu__logo">
        <ImageLogo />Cloud On Mobile
      </p>

      <BaseUpload
        class="left-menu__btn-new-file"
        label="+ Add new file"
      />
      <BaseButton
        :class="isAllFilesBtnActive ? 'left-menu__button-all-files left-menu__button-all-files--active'
          : 'left-menu__button-all-files'"
        :theme="Theme.SIMPLY"
        @click="emit('allFiles')"
      >
        <ButtonAllFiles /> All files
      </BaseButton>
    
      <BaseButton
        :class="isRecentFilesBtnActive ?
          'left-menu__button-recent-files left-menu__button-recent-files--active' :
          'left-menu__button-recent-files'"
        :theme="Theme.SIMPLY"
        @click="emit('sortRecentFiles')"
      >
        <ButtonRecentFiles /> Recent files
      </BaseButton>
    </div>
    
    <BaseButton
      class="left-menu__btn-disconnect"
      :theme="Theme.SIMPLY"
      @click="disconnect"
    >
      <ImageLogOut />
      
      <span class="left-menu__btn-disconnect-text">Disconnect</span>
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.left-menu {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 15px;
  
  &__logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__btn {
    &-new-file {
      width: 100%;
    }

    &-disconnect {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-content: center;

      &-text {
        margin: 12px;
      }
    }
  }

  &__button-all-files {
    color: var(--primary-100, #0E70F1);
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px; /* 150% */
    letter-spacing: 0.048px;
    gap: 16px;
    padding: 0 8px;
    width: 100%;
    &--active {
      border-radius: 8px;
      background: var(--primary-10, #F5FAFF);
    }
  }

  &__button-recent-files {
    color: var(--black, #0C0C0C);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Body/16/Regular */
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    letter-spacing: 0.048px;
    gap: 16px;
    padding: 0 8px;
    width: 100%;
    &--active {
      border-radius: 8px;
      background: var(--primary-10, #F5FAFF);
    }
  }
}
</style>
