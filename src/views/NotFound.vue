<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import NotFoundImage from '@/assets/images/NotFoundImage.svg'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
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
      @click="router.push('/')"
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
    opacity: 0.8;
  }

  &__button {
    margin: calc($spacing-vertical-big * 4);
  }
}
</style>
