<script lang="ts" setup>
import { ShallowRef, Ref, shallowRef, ref, watch, onBeforeUnmount } from 'vue'
import { useContext } from '@/composables/context'
import IconTrash from '@/assets/images/iconsFiles/IconTrash.svg'
import IconDownload from '@/assets/images/iconsFiles/IconDownload.svg'
import IconMore from '@/assets/images/iconsFiles/IconMore.svg'
import File from '@/types/File'
import { iconForExtentionDictionary } from '@/utils/extentionsDictionary'
import BaseDropDown from '@/components/ui/BaseDropDown.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

interface ExtentionList {
  icon: string,
  extention: string[]
}

const props = defineProps<{
  file: File,
  allItemsButtonSelected: boolean,
  closeWidgetClicked:boolean,
  clearItems: boolean,
}>()

const ctx = useContext()
const { modalService } = ctx

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

const { webSocketService } = ctx

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  if(!Number.isFinite(bytes) || bytes < 0) return 'Invalid input'
  const sizes = ['Bytes', 'KB', 'MB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(0)} ${sizes[i]}`
}

function formatTime(epochTime: number) {
  const date = new Date(epochTime * 1000)
  const formattedDate = date.toLocaleDateString()

  return formattedDate.replace(/\//g, '.')
}

function getIcon(fileName: string) {
  let extention = fileName.split('.').pop().split(/[?#]/)[0]
  let extentionListItem: ExtentionList = extentionsList.value.find(item => item.extention.includes(extention)) ||
    extentionsList.value[1]

  return extentionListItem.icon
}

const isSelected: Ref<boolean> = ref(false)
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
    console.log('active')
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
}

const icon = ref(iconForExtentionDictionary(t))
</script>

<template>
  <tr class="file-item-row">
    <td>
      <input
        v-model="isSelected"
        type="checkbox"
        class="file-item-field file-item-field__checkbox"
        @click="toggleSelection"
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
      {{ formatBytes(file.size, 0) }}
    </td>
    <td
      class="file-item-field file-item-field__time"
      data-testid="file-date_epoch"
    >
      {{ formatTime(file.date_epoch) }}
    </td>
    <td class="file-item-field file-item-field__button">
      <button class="file-item-field__button">
        <IconDownload
          class="file-item-field__download-icon"
          @click="webSocketService.downloadFile(file.name)"
        />
      </button>
    </td>
    <td class="file-item-field file-item-field__button">
      <button class="file-item-field__button">
        <IconTrash
          class="file-item-field__delete-icon"
          @click="openModalDeleteFile"
        />
      </button>
    </td>
    <td class="file-item-field file-item-field__button--more">
      <button
        ref="buttonMore"
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
            Download File
          </button>

          <button
            class="file-item-field__dropdown-content-btn"
            @click="openModalDeleteFile"
          >
            <IconTrash
              class="file-item-field__dropdown-content-delete-icon"
            />
            <span class="file-item-field__dropdown-content-delete-icon-text">Delete File</span>
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
  padding-right: 8px;
  @include devices(mobile) {
    max-width: 545px;
    }

  &:hover {
    background: $color-background-divider;
    border-radius: 8px;
  }
}
.file-item-field {
  margin-right: 4px;

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
    opacity: 0.6;
  }

  &__delete-icon {
    opacity: 0.6;
  }

  &__more-icon {
    opacity: 0.6;
  }

  &__dropdown-content {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 8px;

    // &-download-icon {
      
    // }

    &-delete-icon {
      filter: invert(38%) sepia(23%) saturate(3992%) hue-rotate(319deg) brightness(85%) contrast(90%);
      &-text {
        color: #D1405A
      }
    }

    &-btn {
      display: flex;
      gap: 8px;

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

    padding-right: 12px;
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
    // width: 5%;
    border-radius: 8px;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  &__time {
    opacity: 0.6;
    width: 174px
  }

  &__size {
    width: 100px;
    opacity: 0.6;
  }
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
  opacity: 0.2;
  border: 1px solid $color-border-primary;
  border-radius: 4px;
  margin: 12px;
}

input[type="checkbox"]:checked {
  opacity: 1;
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
