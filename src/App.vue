<script setup>
import { computed } from 'vue'

import TheModal from '@/components/TheModal.vue'
import TheLoader from '@/components/TheLoader.vue'

import { useContext } from '@/composables/context'

const ctx = useContext()
const { webSocketService } = ctx

const isPending = computed(() => webSocketService.isPending.value)
</script>

<template>
  <TheLoader v-if="isPending" />

  <router-view />

  <TheModal />
</template>

<style>
#app {
  height: 100%;
}

body {
  margin: 0;
  height: 100vh;
}

@media only screen and (min-width: 1520px) {
  body {
    display: flex;
    justify-content: center;
    height: 100%;
  }
}
</style>
