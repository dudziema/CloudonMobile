<script setup lang="ts">
import { useContext } from '@/composables/context'
import { useRouter } from 'vue-router'

import Theme from '@/types/Theme'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseUpload from '@/components/ui/BaseUpload.vue'

import ImageLogo from '@/assets/images/buttons/ImageLogo.svg'
import ImageLogOut from '@/assets/images/buttons/ImageLogOut.svg'
import ButtonAllFilesIcon from '@/assets/images/buttons/ButtonAllFiles.svg'
import ButtonAllFilesIconActive from '@/assets/images/buttons/ButtonAllFilesActive.svg'
import ButtonRecentFilesIcon from '@/assets/images/buttons/ButtonRecentFiles.svg'
import ButtonRecentFilesIconActive from '@/assets/images/buttons/ButtonRecentFilesActive.svg'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps<{
  isAllFilesBtnActive: boolean,
  isRecentFilesBtnActive: boolean,
}>()

const emit = defineEmits(['allFiles', 'sortRecentFiles', 'butonFileUploadClicked'])

const router = useRouter()
const ctx = useContext()
const { webSocketService, modalService } = ctx

function disconnect() {
  modalService.open({
    title: t('dashboard.disconnectAccount'),
    description: t('dashboard.disconnectAreYouSureText'),
    buttonAction: {
      text: t('dashboard.disconnect'),
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
        <ImageLogo />
        
        {{ $t("cloudOnMobile") }}
      </p>

      <BaseUpload
        class="left-menu__btn-new-file"
        :label="t('dashboard.addNewFile')"
        @buton-file-upload-clicked="emit('butonFileUploadClicked')"
      />
      <BaseButton
        :class="isAllFilesBtnActive ? 'left-menu__button-all-files left-menu__button-all-files--active'
          : 'left-menu__button-all-files'"
        :theme="Theme.SIMPLY"
        @click="emit('allFiles')"
      >
        <ButtonAllFilesIconActive v-if="isAllFilesBtnActive" />
        <ButtonAllFilesIcon v-else />

        {{ $t("dashboard.allFiles") }}
      </BaseButton>
    
      <BaseButton
        :class="isRecentFilesBtnActive ?
          'left-menu__button-recent-files left-menu__button-recent-files--active' :
          'left-menu__button-recent-files'"
        :theme="Theme.SIMPLY"
        @click="emit('sortRecentFiles')"
      >
        <ButtonRecentFilesIconActive v-if="isRecentFilesBtnActive" />
        <ButtonRecentFilesIcon v-else />

        {{ $t("dashboard.recentFiles") }}
      </BaseButton>
    </div>
    
    <BaseButton
      class="left-menu__btn-disconnect"
      :theme="Theme.SIMPLY"
      @click="disconnect"
    >
      <ImageLogOut />
      
      <span class="left-menu__btn-disconnect-text">{{ $t("dashboard.disconnect") }}</span>
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
  
  &__upper {
    gap: 12px;
    display: flex;
    flex-direction: column;
  }
  
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
    color: var(--black, #0C0C0C);
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    letter-spacing: 0.048px;
    gap: 16px;
    padding: 0 8px;
    width: 100%;

    &-icon {
      filter: invert(0%) sepia(73%) saturate(362%) hue-rotate(320deg) brightness(98%) contrast(91%);
      &--active {

      }
    }
    &--active {
      border-radius: 8px;
      background: var(--primary-10, #F5FAFF);
      font-weight: 600;
      color: var(--primary-100, #0E70F1);
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
    &-icon {
      &--active {
      filter: invert(40%) sepia(94%) saturate(4827%) hue-rotate(206deg) brightness(97%) contrast(94%);
      }
    }
    &--active {
      border-radius: 8px;
      background: var(--primary-10, #F5FAFF);
      font-weight: 600;
      color: var(--primary-100, #0E70F1);
    }
  }

}
</style>
