<script lang="ts" setup>
import { Ref, ref, onMounted } from 'vue'
import { WebSocketConnect } from '@/classes/services/WebSocketService'
import BaseButton from '@/components/ui/BaseButton.vue'
import ButtonAppstore from '@/assets/images/buttons/ButtonAppstore'
import ButtonGoogle from '@/assets/images/buttons/ButtonGoogle'
import MessageTypes from '@/types/MessageTypes'
import { useContext } from '@/composables/context'

const QUANTITY_INPUTS = 6
const PASSCODE_INPUTS: Ref<{ id: number, value: string }[]> = ref([])
const ctx = useContext()
const { webSocketService } = ctx

onMounted(() => {
  for (let i = 0; i < QUANTITY_INPUTS; i++ ) {
    PASSCODE_INPUTS.value.push({ id: i, value: '' })
  }
})

function next(e: any) {
  if (
    e.inputType === 'deleteContentBackward' ||
    e.target?.nextSibling?.nodeType !== 1
  )
    return
  e.target?.nextSibling?.focus()
}

function previous(e: any) {
  if (e.target?.previousSibling?.nodeType !== 1) return
  e.target?.previousSibling?.focus()
}

function getPasscodeInputs() {
  let code: string[] = []
  PASSCODE_INPUTS.value.forEach(codeNumber => {
    code.push(codeNumber.value)
  })

  return code
}

function connect() {
  let passCode: number = parseInt(getPasscodeInputs().join(''))
  webSocketService.login(passCode)

  // const webSocketConnect = new WebSocketConnect(
  //   passCode,
  //   function () {
  //     alert('Server is closed. Try again later.')
  //   }
  // )
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__divider" />

    <div class="login-page__content">
      <h1>Enter the access code</h1>

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
            type="text"
            autocomplete="nope"
            pattern="'[0-9]*"
            inputmode="numeric"
            maxlength="1"
            required
            @input="next"
            @keyup.backspace="previous"
          />
        </form>

        <BaseButton
        class="login-page__button"
          theme="active"
          @click="connect()"
        >
          Connect
        </BaseButton>
      </div>

      <p class="login-page__download">Download the mobile app</p>

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

  &__divider {
    background-color: $color-background-divider;
    grid-column-start: 1;
    grid-column-end: 5;
    grid-row-start: 1;
    grid-row-end: row10-end;
  }
  &__content {
    grid-column-start: 6;
    grid-column-end: 10;
    grid-row-start: 2;
    grid-row-end: 10;
  }
  &__details {
    margin: 16px 0 56px 0;
    max-width: 390px;
    font-weight: 400;
    opacity: 0.8;
  }
  &__inputs {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
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
}
input {
  height: 64px;
  width: 61px;
  left: 0px;
  top: 0px;
  border-radius: 8px;
  background-color: $color-background-inputs;
  display: flex;
  text-align: center;
  font-weight: 500;
  font-size: 32px;
  &:focus {
    border: 2px solid $color-border-default;
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
