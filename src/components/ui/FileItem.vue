<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import IconTrash from '@/assets/images/iconsFiles/IconTrash.svg'
import IconDownload from '@/assets/images/iconsFiles/IconDownload.svg'
import IconMore from '@/assets/images/iconsFiles/IconMore.svg'

import BaseDropDown from '@/components/ui/BaseDropDown.vue'

import { useContext } from '@/composables/context'

import { iconForExtensionDictionary } from '@/utils/extensionsDictionary'

import File from '@/types/File'

const ZERO = 0
const ONE_SECOND = 1000

const props = defineProps<{
  file: File,
  allItemsButtonSelected: boolean,
  closeWidgetClicked:boolean,
  clearItems: boolean,
}>()

const ctx = useContext()
const { modalService, webSocketService } = ctx

const { t } = useI18n()

const openModalDeleteFile = () => {
  modalService.open({
    title: t('dashboard.deleteFileTitle'),
    description: t('dashboard.deleteAreYouSureText'),
    buttonAction: {
      text: t('dashboard.delete'),
      callback: () => {
        webSocketService.deleteFile(props.file.name)
        modalService.close()
      },
    },
  })
}

function formatBytes(bytes: number) {
  if (bytes === ZERO) return '0 Bytes'
  if(!Number.isFinite(bytes) || bytes < ZERO) return t('dashboard.invalidInput')
  const sizes = ['Bytes', 'KB', 'MB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(ZERO)} ${sizes[i]}`
}

function formatTime(epochTime: number) {
  const date = new Date(epochTime * ONE_SECOND)
  const formattedDate = date.toLocaleDateString()

  return formattedDate.replace(/\//g, '.')
}

const isSelected = ref(false)
const emit = defineEmits(['isSelected'])

watch(props, newValue => {
  if(newValue.allItemsButtonSelected !== undefined) isSelected.value = newValue.allItemsButtonSelected
  if(newValue.closeWidgetClicked || newValue.clearItems) isSelected.value = false
})

watch(isSelected, newValue => {
  emit('isSelected', props.file, newValue)
})

const isDropdownActive = ref(false)
const buttonMore = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if(buttonMore.value && !buttonMore.value.contains(event.target as Node)) {
    isDropdownActive.value = false
    document.removeEventListener('click', handleClickOutside)
  }
}

function toggleDropdown(){
  isDropdownActive.value = !isDropdownActive.value

  if(isDropdownActive.value) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
}

const icon = ref(iconForExtensionDictionary(t))
</script>

<template>
  <tr class="file-item-row">
    <td>
      <input
        v-model="isSelected"
        type="checkbox"
        class="file-item-field file-item-field__checkbox"
      >
    </td>

    <td
      class="file-item-field file-item-field__image"
      data-testid="file-icon"
    >
      <component
        :is="icon[file.type]"
      />
    </td>

    <td
      class="file-item-field file-item-field__name"
      data-testid="file-name"
    >
      {{ file.name }}
    </td>

    <td
      class="file-item-field file-item-field__size"
      data-testid="file-size"
    >
      {{ formatBytes(file.size) }}
    </td>

    <td
      class="file-item-field file-item-field__time"
      data-testid="file-date_epoch"
    >
      {{ formatTime(file.date_epoch) }}
    </td>

    <td class="file-item-field file-item-field__button">
      <button
        name="download"
        type="button"
        class="file-item-field__button"
      >
        <IconDownload
          class="file-item-field__download-icon"
          @click="webSocketService.downloadFile(file.name)"
        />
      </button>
    </td>

    <td class="file-item-field file-item-field__button">
      <button
        name="delete"
        type="button"
        class="file-item-field__button"
      >
        <IconTrash
          class="file-item-field__delete-icon"
          @click="openModalDeleteFile"
        />
      </button>
    </td>

    <td class="file-item-field file-item-field__button--more">
      <button
        ref="buttonMore"
        name="more"
        type="button"
        class="file-item-field__button--more"
      >
        <IconMore
          class="file-item-field__more-icon"
          @click="toggleDropdown"
        />
      </button>

      <BaseDropDown v-if="isDropdownActive">
        <div class="file-item-field__dropdown-content">
          <button
            class="file-item-field__dropdown-content-btn"
            @click="webSocketService.downloadFile(file.name)"
          >
            <IconDownload
              class="file-item-field__dropdown-content-download-icon"
            />
            {{ $t('dashboard.downloadFile') }}
          </button>

          <button
            class="file-item-field__dropdown-content-btn"
            @click="openModalDeleteFile"
          >
            <IconTrash
              class="file-item-field__dropdown-content-delete-icon"
            />

            <span class="file-item-field__dropdown-content-delete-icon-text">
              {{ $t('dashboard.deleteFileTitle') }}
            </span>
          </button>
        </div>
      </BaseDropDown>
    </td>
  </tr>
</template>

<style lang="scss" scoped>

.file-item-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
  padding-right: $spacing-horizontal-small;

  @include devices(mobile) {
    max-width: 545px;
  }

  &:hover {
    background: $color-background-divider;
    border-radius: $radius-small;
  }
}
.file-item-field {
  margin-right: calc($spacing-horizontal-small / 2);

  &__checkbox {
    @include devices(mobile) {
      display: none;
    }
  }

  &__size {
    @include devices(mobile) {
      display: none;
    }

    @include devices(tablet-min) {
      display: none;
    }
  }

  &__time {
    @include devices(mobile) {
      display: none;
    }
  }

  &__download-icon {
    opacity: $opacity-default;
  }

  &__delete-icon {
    opacity: $opacity-default;
  }

  &__more-icon {
    opacity: $opacity-default;
  }

  &__dropdown-content {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: $gap-default;

    &-delete-icon {
      filter: invert(38%) sepia(23%) saturate(3992%) hue-rotate(319deg) brightness(85%) contrast(90%);

      &-text {
        color: $color-text-error;
      }
    }

    &-btn {
      display: flex;
      gap: $gap-default;

      &:hover {
        background: $color-background-divider;
      }
    }
  }

  &__button {
    width: 40px;

    @include devices(tablet-min) {
      display: none
    }

    &--more {
      position: relative;
      display: inline-block;
    }
  }

  &__name {
    padding-right: calc($spacing-horizontal-small + ($spacing-horizontal-small / 2));
    overflow: hidden;
    text-overflow: ellipsis;
    height: 24px;
    flex: 1;

    @include devices(mobile) {
      width: $widthColumnNameMobile;
    }

    @include devices(tablet-min) {
      width: $widthColumnNameTabletMin;
    }

    @include devices(tablet) {
      max-width: $widthColumnNameTablet;
    }

    @include devices(desktop-small) {
      max-width: $widthColumnNameDesktop;
    }
  }

  &__image {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
    border-radius: $gap-default;
  }

  &__time {
    opacity: $opacity-default;
    width: 174px
  }

  &__size {
    opacity: $opacity-default;
    width: 100px;
  }
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
  opacity: $opacity-small;
  border: $border-primary;
  border-radius: calc($radius-small / 2);
  margin: calc($spacing-horizontal-small + ($spacing-horizontal-small / 2));
}

input[type="checkbox"]:checked {
  opacity: $opacity-none;
}

@include devices(tablet) {
  .file-item-field__button{
    display: none !important;
  }
}

@include devices(only-desktop) {
  .file-item-field__button--more{
    display: none !important;
  }
}

</style>
