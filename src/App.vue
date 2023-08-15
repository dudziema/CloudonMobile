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
  display: flex;
  justify-content: center;
}
</style>
