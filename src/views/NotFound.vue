<script lang="ts" setup>
import { shallowRef } from 'vue'
import NotFoundImage from '@/assets/images/NotFoundImage.svg'
import BaseButton from '@/components/ui/BaseButton.vue'

const title = shallowRef('Ooops!')
const description = shallowRef('The page you are looking for is not here.')
const description2 = shallowRef('Please try again.')
</script>

<template>
  <div class="not-found">
    <NotFoundImage class="not-found__image" />
    <h2 class="not-found__title">{{ title }}</h2>
    <p class="not-found__description">
      <span>{{ description }}</span>
      <span>{{ description2 }}</span>
    </p>

    <BaseButton
      theme="special"
      class="not-found__button"
    >
      Go back
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
    margin: 100px 0 32px 0;
  }

  &__title {
    margin: 16px;
    font-weight: 600;
    font-size: 32px;
    line-height: 40px;
    max-width: 610px;
  }

  &__description {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-weight: 200;
    font-size: 16px;
    line-height: 24px;
    opacity: 0.8;
    max-height: 48px;
  }

  &__button {
    margin: 80px;
  }
}
</style>
