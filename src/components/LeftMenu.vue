<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import ImageLogo from '@/assets/images/buttons/ImageLogo.svg'
import ImageLogOut from '@/assets/images/buttons/ImageLogOut.svg'
import ButtonAllFilesIcon from '@/assets/images/buttons/ButtonAllFiles.svg'
import ButtonAllFilesIconActive from '@/assets/images/buttons/ButtonAllFilesActive.svg'
import ButtonRecentFilesIcon from '@/assets/images/buttons/ButtonRecentFiles.svg'
import ButtonRecentFilesIconActive from '@/assets/images/buttons/ButtonRecentFilesActive.svg'

import Theme from '@/types/Theme'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseUpload from '@/components/ui/BaseUpload.vue'

import { useContext } from '@/composables/context'

const { t } = useI18n()

defineProps({
  isAllFilesBtnActive: {
    type: Boolean,
    required: true
  },
  isRecentFilesBtnActive: {
    type: Boolean,
    required: true
  }

})

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
        :class="['left-menu__button-all-files', {'left-menu__button-all-files--active' : isAllFilesBtnActive}]"
        :theme="Theme.SIMPLY"
        @click="emit('allFiles')"
      >
        <ButtonAllFilesIconActive v-if="isAllFilesBtnActive" />

        <ButtonAllFilesIcon v-else />

        {{ $t("dashboard.allFiles") }}
      </BaseButton>
    
      <BaseButton
        :class="['left-menu__button-recent-files', { 'left-menu__button-recent-files--active': isRecentFilesBtnActive }]"
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
  padding: $spacing-horizontal-big;
  
  &__upper {
    display: flex;
    flex-direction: column;
    gap: $gap-big;
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
      display: flex;
      align-content: center;
      font-weight: $font-weight-regular;
      font-size: $font-size-base;
      line-height: $line-height-base;

      &-text {
        margin: calc($spacing-horizontal-small + ($spacing-horizontal-small / 2));
      }
    }
  }

  &__button-all-files {
    color: $color-text-default;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: $font-size-base;
    font-weight: $font-weight-regular;
    line-height: $line-height-base;
    letter-spacing: 0.048px;
    gap: calc( 2 * $gap-default);
    padding: 0 $spacing-horizontal-small;
    width: 100%;

    &-icon {
      filter: invert(0%) sepia(73%) saturate(362%) hue-rotate(320deg) brightness(98%) contrast(91%);
    }

    &--active {
      border-radius: $radius-small;
      background: $color-background-divider;
      font-weight: $font-weight-semi-bold;
      color: $color-text-dark;
    }
  }

  &__button-recent-files {
    color: $color-text-default;
    gap: calc(2 * $gap-default);
    padding: 0 $spacing-horizontal-small;
    width: 100%;

    &-icon {
      &--active {
        filter: invert(40%) sepia(94%) saturate(4827%) hue-rotate(206deg) brightness(97%) contrast(94%);
      }
    }

    &--active {
      border-radius: $radius-small;
      background: $color-background-divider;
      font-weight: $font-weight-semi-bold;
      color: $color-text-dark;
    }
  }
}
</style>
