<script setup lang="ts">
import { useContext } from '@/composables/context'
import { useRouter } from 'vue-router'

import Theme from '@/types/Theme'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseUpload from '@/components/ui/BaseUpload.vue'

import ImageLogo from '@/assets/images/buttons/ImageLogo.svg'
import ImageLogOut from '@/assets/images/buttons/ImageLogOut.svg'

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
}
</style>
