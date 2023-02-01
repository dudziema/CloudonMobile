<script setup>
import TheModal from '@/components/TheModal.vue'
</script>

<template>
  <router-view />
  <TheModal />
</template>

<style>
#app {
  min-height: 100vh;
}
body {
  overflow-y: hidden;
  margin: 0;
}
</style>
