<script setup>
import TheModal from '@/components/TheModal.vue'
</script>

<template>
  <router-view />
  <TheModal />
</template>

<style>
body {
  margin: 0;
  height: 100vh;
}

@media only screen and (min-width: 1520px) {
  body {
    display: flex;
    justify-content: center;
  }
}
</style>
