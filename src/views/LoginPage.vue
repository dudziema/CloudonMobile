<script lang="ts" setup>
import { Ref, ref,onMounted, computed, ComputedRef } from 'vue'
import { Router, useRouter } from 'vue-router'
import { useContext } from '@/composables/context'
import BaseButton from '@/components/ui/BaseButton.vue'
import ButtonAppstore from '@/assets/images/buttons/ButtonAppstore.svg'
import ButtonGoogle from '@/assets/images/buttons/ButtonGoogle.svg'
import Theme from '@/types/Theme'
import Message from '@/types/Message'

const PASSCODE_INPUTS: Ref<{ id: number, value: string }[]> = ref([])
const ctx = useContext()
const { webSocketService , modalService} = ctx
const router: Router = useRouter()
const isPasscodeCorrect: Ref<boolean> = ref(true)
const passcode: Ref<number> | Ref<null> = ref(null)

onMounted(
  () => {
    let inputsQuantity = 6

    while(inputsQuantity){
      PASSCODE_INPUTS.value.push({ id: inputsQuantity, value: '' })
      inputsQuantity --
    }
  },

  webSocketService.addWsOnMessageListener(function (messageFromServer: Message) {
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

const isAllValuesFilled: ComputedRef<boolean> = computed(() => PASSCODE_INPUTS.value.every(input => input.value))

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

    if(previousSibling?.nodeType === 1) previousSibling?.focus()
  } else {
    if(nextSibling?.nodeType !== 1 && target.value !== '') {
      return
    } else if(isNumeric) {
      input.value= event.key

      if(nextSibling?.nodeType === 1) nextSibling?.focus()
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

const ifErrorShowModal = () => {
  modalService.open({
    title: 'Something went wrong  :(',
    description: 'There was a problem with connection with the mobile app. Please try again later.',
    buttonAction: {
      text: 'Close',
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
      <h1 class="login-page__title">Enter the access code</h1>

      <p class="login-page__details">
        To connect with your device, please enter the access code displayed in
        the mobile app.
      </p>

      <div>
        <form class="login-page__inputs">
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
            :class="isPasscodeCorrect ? `login-page__input login-page__input--correct` :
              `login-page__input login-page__input--wrong`"
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
          Connect
        </BaseButton>
      </div>

      <p class="login-page__download">
        Download the mobile app
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
  gap: 8px 8px;
  overflow-y: hidden; /* Hide vertical scrollbar */
  overflow-x: hidden;
  height: 100vh;
  width:100%;

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
    margin: 16px 0 56px 0;
    max-width: 390px;
    opacity: 0.8;
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
    border-radius: 8px;
    background-color: $color-background-inputs;
    font-size: calc($font-size-base * 2);
    
    &:focus {
      border: 2px solid $color-border-default;
    }

    &--focused {
      background-color: $color-background-main;
      border: 2px solid $color-border-default;
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
    margin: 60px 0 20px 0;
  }
  &__button {
    width: 100%;
    margin-top: 56px;
  }
  &__input {
    &--wrong{
      border: solid 2px $color-border-error;
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
