import { markRaw } from 'vue'
import { ComposerTranslation } from 'vue-i18n'

import IconImage from '@/assets/images/iconsFiles/IconImage.svg'
import IconDoc from '@/assets/images/iconsFiles/IconDoc.svg'
import IconFilm from '@/assets/images/iconsFiles/IconFilm.svg'
import IconMusic from '@/assets/images/iconsFiles/IconMusic.svg'

interface ExtensionsDictionary {
  [key: string]: string[];
}

interface IconDictionary {
  [key: string]: SVGElement;
}

export const extensionsDictionary = (t: ComposerTranslation): ExtensionsDictionary => ({
  [t('dashboard.pictures')]: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  [t('dashboard.files')]: ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'],
  [t('dashboard.videos')]: ['mp4', 'wmv', 'avi'],
  [t('dashboard.soundFiles')]: ['mp3'],
})

export const iconForExtensionDictionary = (t: ComposerTranslation): IconDictionary => ({
  [t('dashboard.pictures')]: markRaw(IconImage),
  [t('dashboard.files')]: markRaw(IconDoc),
  [t('dashboard.videos')]: markRaw(IconFilm),
  [t('dashboard.soundFiles')]: markRaw(IconMusic),
})
