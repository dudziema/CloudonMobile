<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import ButtonAppstore from '@/assets/images/buttons/ButtonAppstore.svg'
import ButtonGoogle from '@/assets/images/buttons/ButtonGoogle.svg'

import BaseButton from '@/components/ui/BaseButton.vue'

import { useContext } from '@/composables/context'

import Theme from '@/types/Theme'

import type { MessageLogin } from '@/types/message-received/MessageLogin'

const PASSCODE_INPUTS = ref<{ id: number, value: string }[]> ([])
const IS_INPUT = 1

const ctx = useContext()
const { webSocketService , modalService} = ctx

const router = useRouter()

const isPasscodeCorrect = ref<boolean>(true)
const passcode = ref<number | null>(null)

onMounted(
  () => {
    let inputsQuantity = 6

    while(inputsQuantity){
      PASSCODE_INPUTS.value.push({ id: inputsQuantity, value: '' })
      inputsQuantity --
    }
  },

  webSocketService.addWsOnMessageListener(function (messageFromServer: MessageLogin) {
    console.log(messageFromServer)

    if(messageFromServer.result) {
      // Wrong passcode
      isPasscodeCorrect.value = false
    } else if(!messageFromServer.result) {
      // Correct passcode
      isPasscodeCorrect.value = true
      router.push({
        name: 'Dashboard',
        params: {
          passcode: passcode.value
        }
      })
    }
  })
)

const isAllValuesFilled = computed(() => PASSCODE_INPUTS.value.every(input => input.value))

function pressKey(event: KeyboardEvent, inputId: number) {
  const pressedKey = event.key
  const target = event.target as  HTMLButtonElement
  const nextSibling = target.nextSibling as HTMLElement
  const previousSibling = target.previousSibling as HTMLElement
  const input = PASSCODE_INPUTS.value.find(input=> input.id === inputId)
  const isNumeric = /^\d$/.test(pressedKey)

  if(!target || !input) return

  if(event.key === 'Backspace') {
    input.value = ''

    if(previousSibling?.nodeType === IS_INPUT) previousSibling?.focus()
  } else {
    if(nextSibling?.nodeType !== IS_INPUT && target.value !== '') {
      return
    } else if(isNumeric) {
      input.value= event.key

      if(nextSibling?.nodeType === IS_INPUT) nextSibling?.focus()
    }
  }
}

function getPasscodeInputs() {
  let code: string[] = []
  PASSCODE_INPUTS.value.forEach(codeNumber => {
    code.push(codeNumber.value)
  })

  return code
}

const { t } = useI18n()

const ifErrorShowModal = () => {
  modalService.open({
    title: t('dashboard.errorModalTitle'),
    description: t('dashboard.errorModalDescription'),
    buttonAction: {
      text: t('dashboard.close'),
      callback: () => modalService.close()
    },
    isCancel: false
  })
}

function connect() {
  isPasscodeCorrect.value = true

  if(isAllValuesFilled.value) {
    passcode.value = parseInt(getPasscodeInputs().join(''))
    webSocketService.login(passcode.value, ifErrorShowModal)
  } else {
    isPasscodeCorrect.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__divider" />

    <div class="login-page__content">
      <h1 class="login-page__title">
        {{ $t("login.enterCode") }}
      </h1>

      <p class="login-page__details">
        {{ $t("login.enterCodeDescription") }}
      </p>

      <div>
        <form
          id="login-form"
          name="login"
          class="login-page__inputs"
        >
          <input
            v-for="input in PASSCODE_INPUTS"
            :key="input.id"
            v-model="input.value"
            data-testid="login-input"
            type="text"
            autocomplete="nope"
            pattern="'[0-9]*"
            inputmode="numeric"
            maxlength="1"
            required
            :class="['login-page__input', {'login-page__input--correct': isPasscodeCorrect},
                     { 'login-page__input--wrong' : !isPasscodeCorrect}]"
            @keydown.prevent="pressKey($event, input.id)"
            @keyup.enter="connect()"
          />
        </form>

        <BaseButton
          class="login-page__button"
          :theme="isAllValuesFilled ? Theme.ACTIVE : Theme.INACTIVE"
          data-testid="login-button"
          @click="connect()"
        >
          {{ $t("login.connect") }}
        </BaseButton>
      </div>

      <p class="login-page__download">
        {{ $t("login.downloadApp") }}
      </p>

      <div class="login-page__stores">
        <ButtonAppstore class="login-page__store" />

        <ButtonGoogle class="login-page__store" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: grid;
  grid-auto-rows: auto;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: $gap-default $gap-default;
  overflow-y: hidden;
  overflow-x: hidden;
  height: 100vh;
  width: 100%;

  &__divider {
    background-color: $color-background-divider;
    grid-column-start: 1;
    grid-column-end: 5;
    grid-row-start: 1;
    grid-row-end: row11-end;

    @include devices(desktop-small) {
      display: none;
    }
  }

  &__content {
    grid-column-start: 6;
    grid-column-end: 10;
    grid-row-start: 2;
    grid-row-end: 10;
    max-width: 500px;
    
    @include devices(desktop-small) {
      grid-column-start: 3;
      grid-column-end: 10;
      grid-row-start: 2;
      grid-row-end: 10;
    }
    
    @include devices(mobile) {
      grid-column-start: 2;
    }
  }

  &__title {
    text-align: left;

    @include devices(desktop-small) {
      text-align: center;
    }
  }

  &__details {
    margin: $spacing-vertical-default 0 calc(7 * $spacing-vertical-small) 0;
    max-width: 390px;
    opacity: $opacity-large;
    text-align: left;
    
    @include devices(desktop-small) {
      text-align: center;
      max-width: 100%;
    }
  }

  &__inputs {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }

  &__input {
    display: flex;
    text-align: center;
    height: 64px;
    width: 61px;
    border-radius: $radius-small;
    background-color: $color-background-inputs;
    font-size: calc($font-size-base * 2);
    
    &:focus {
      border: $border-dark20;
    }

    &--focused {
      background-color: $color-background-main;
      border: $border-dark20;
    }
   
    @include devices(mobile) {
      width: 44px;
    }
  }

  &__stores {
    display: flex;
    justify-content: space-around;
  }

  &__store {
    width: 120px;
  }

  &__download {
    text-align: center;
    margin: calc(3 * $spacing-vertical-big) 0 $spacing-vertical-big 0;
  }

  &__button {
    width: 100%;
    margin-top: calc(7 * $spacing-vertical-small);
  }
  
  &__input {
    &--wrong{
      border: $border-error;
      animation: shake .5s linear;
    }
  }
}
  /* Hide scrollbar for Chrome, Safari and Opera */
.login-page::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.login-page {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
