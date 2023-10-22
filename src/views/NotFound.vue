<script lang="ts" setup>
import { useRouter } from 'vue-router'

import NotFoundImage from '@/assets/images/NotFoundImage.svg'

import BaseButton from '@/components/ui/BaseButton.vue'

import Theme from '@/types/Theme'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <NotFoundImage class="not-found__image" />

    <h2 class="not-found__title">
      {{ $t('notFound.ops') }}
    </h2>

    <p class="not-found__description">
      <span>{{ $t('notFound.isNotHere') }}</span>
      <span>{{ $t('notFound.tryAgain') }}</span>
    </p>

    <BaseButton
      :theme="Theme.SPECIAL"
      class="not-found__button"
      @click="router.push('/')"
    >
      {{ $t('notFound.buttonText') }}
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;

  &__image {
    margin: calc($spacing-vertical-big * 2) 0 calc($spacing-vertical-small * 4) 0;
  }

  &__title {
    margin: $spacing-vertical-default 0;
    font-weight: $font-weight-semi-bold;
    font-size: $font-size-title;
  }

  &__description {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-weight: $font-weight-thin;
    opacity: $opacity-large;
  }

  &__button {
    margin: calc($spacing-vertical-big * 4);
  }
}
</style>
