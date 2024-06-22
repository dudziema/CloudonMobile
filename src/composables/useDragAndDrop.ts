import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { useContext } from '@/composables/context'

export function useDragAndDrop() {
  const router = useRouter()

  const { t } = useI18n()

  const ctx = useContext()
  const { webSocketService, modalService } = ctx

  const ifErrorShowModal = () => {
    modalService.open({
      title: t('dashboard.errorModalTitle'),
      description: t('dashboard.errorModalDescription'),
      buttonAction: {
        text: t('dashboard.close'),
        callback: () => {
          modalService.close()
          router.push('/')
        }
      },
      isCancel: false
    })
  }

  const onDrop = (ev: DragEvent) => {
    if(!ev?.dataTransfer?.items) return ifErrorShowModal()
      
    for (const item of ev.dataTransfer.items) {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        webSocketService.sendFile(file)
      }else {
        modalService.open({
          title: t('dashboard.uploadModalTitle'),
          description: '',
          buttonAction: {
            text: t('dashboard.close'),
            callback: () => {
              modalService.close()
            }
          },
          isCancel: false
        })
      }
    }
  }

  return {
    ifErrorShowModal,
    onDrop
  }
}
