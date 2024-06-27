import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useContext } from '@/composables/context'

export function useFilesActions() {
  const { t } = useI18n()

  const ctx = useContext()
  const { webSocketService, modalService } = ctx

  const selectedFiles = ref<File[]>([])
  const clearItems = ref(false)
  const closeWidgetClicked = ref(false)

  const quantityItemsSelected = computed(()=> selectedFiles.value.length)
  const quantityFileName = computed(() => quantityItemsSelected.value > 1
    ? t('dashboard.files')
    : t('dashboard.file'))

  const itemsSelected = (itemsSelected: File[]) =>{
    selectedFiles.value = itemsSelected
  }

  const deleteFiles = () => {
    modalService.open({
      title: `${t('dashboard.delete')} ${ quantityItemsSelected.value } ${ quantityFileName.value }`,
      description: `${t('dashboard.areYouSureText')} ${ quantityItemsSelected.value } ${ quantityFileName.value } ${t('dashboard.areYouSureTextContinued')}`,
      buttonAction: {
        text: t('dashboard.delete'),
        callback: () => {
          selectedFiles.value.forEach(file => {
            webSocketService.deleteFile(file.name)
          })
          clearItems.value = false
          closeWidgetClicked.value = true
          modalService.close()
        },
      },
    })
  }

  const downloadFiles = () =>{
    clearItems.value = true
    selectedFiles.value.forEach(file => {
      webSocketService.downloadFile(file.name)
    })
    clearItems.value = false
    closeWidgetClicked.value = true
  }

  const closeWidget = () =>{
    closeWidgetClicked.value = true
  }

  return {
    clearItems,
    closeWidgetClicked,
    selectedFiles,
    quantityItemsSelected,
    quantityFileName,
    closeWidget,
    deleteFiles,
    downloadFiles,
    itemsSelected
  }
}
