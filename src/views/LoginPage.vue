<script lang="ts" setup>
import { ref, computed } from 'vue'
import { WebSocketConnect } from '@/services/webSocketService'
import BaseButton from '@/components/ui/BaseButton.vue'
import ButtonAppstore from '@/assets/images/buttons/ButtonAppstore'
import ButtonGoogle from '@/assets/images/buttons/ButtonGoogle'

interface PasscodeInput {
  id: number
  focus: boolean
  autocomplete: string
  pattern: string
  inputmode: string
  maxLength: number
  type: string
  setDataAction: (id: PasscodeInput['id'], data: string) => void
  value: string
}

const DEFAULT_ORDER_STEP_INDEX = 0
const dataByStepId = ref()

const currentStepIndex = computed((): number => {
  const activeStepId = activeStep.value.id

  return (
    PASSCODE_INPUTS.findIndex(({ id }) => id === activeStepId) ||
    DEFAULT_ORDER_STEP_INDEX
  )
})

const setData = (id: PasscodeInput['id'], data: string) => {
  dataByStepId.value[id] = data
  releaseNextStep()
}

const PASSCODE_INPUTS: PasscodeInput[] = [
  {
    id: 0,
    focus: true,
    autocomplete: 'nope',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    maxLength: 1,
    type: 'text',
    setDataAction: setData,
    value: '',
  },
  {
    id: 1,
    focus: false,
    autocomplete: 'nope',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    maxLength: 1,
    type: 'text',
    setDataAction: setData,
    value: '',
  },
  {
    id: 2,
    focus: false,
    autocomplete: 'nope',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    maxLength: 1,
    type: 'text',
    setDataAction: setData,
    value: '',
  },
  {
    id: 3,
    focus: false,
    autocomplete: 'nope',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    maxLength: 1,
    type: 'text',
    setDataAction: setData,
    value: '',
  },
  {
    id: 4,
    focus: false,
    autocomplete: 'nope',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    maxLength: 1,
    type: 'text',
    setDataAction: setData,
    value: '',
  },
  {
    id: 5,
    focus: false,
    autocomplete: 'nope',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    maxLength: 1,
    type: 'text',
    setDataAction: setData,
    value: '',
  },
]
const activeStep = ref(PASSCODE_INPUTS[DEFAULT_ORDER_STEP_INDEX])

const releaseNextStep = () => {
  if (currentStepIndex.value < PASSCODE_INPUTS.length - 1) {
    activeStep.value = PASSCODE_INPUTS[currentStepIndex.value + 1]
  }
}

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

function connect() {
  let code = getPasscodeInputs()
  const webSocketConnect = new WebSocketConnect(
    function () {
      alert('connected')
    },
    function () {
      alert('Server is closed. Try again later.')
    }
  )
}

function getPasscodeInputs() {
  let code: string[] = []
  PASSCODE_INPUTS.forEach(codeNumber => {
    code.push(codeNumber.value)
  })

  return code
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
            v-for="(input, index) in PASSCODE_INPUTS"
            :key="index"
            v-model="input.value"
            :v-focus="input.focus"
            :type="input.type"
            :autocomplete="input.autocomplete"
            :pattern="input.pattern"
            :inputmode="input.inputmode"
            :maxlength="input.maxLength"
            required
            @input="next"
            @keyup.backspace="previous"
          />
        </form>

        <BaseButton
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
  height: 100vh;

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
</style>
