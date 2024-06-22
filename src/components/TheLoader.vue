<script setup lang="ts">
import LoadingImage from '@/assets/images/LoadingImage.svg'

</script>

<template>
  <div class="loader">
    <LoadingImage />

    <h1>{{ $t('loading.loading') }}</h1>

    <p>
      {{ $t('loading.loadingDescription') }}
    </p>

    <!-- This is the loader animation -->
    <div class="loader-spinner" />
  </div>
</template>

<style lang="scss" scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: $color-basic;
  gap: 8px;
  z-index: 3;
}
.loader-spinner {
  margin-top: 34px;
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side,#1BC47D 94%,#0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%,#0E70F1);
  mask: radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0);
  -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0);
  animation: l13 1s infinite linear;
}
@keyframes l13{
  100%{transform: rotate(1turn)}
}
</style>
