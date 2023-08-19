import IconImage from '@/assets/images/iconsFiles/IconImage.svg'
import IconDoc from '@/assets/images/iconsFiles/IconDoc.svg'
import IconFilm from '@/assets/images/iconsFiles/IconFilm.svg'
import IconMusic from '@/assets/images/iconsFiles/IconMusic.svg'

import { markRaw } from 'vue'

export const extentionsDictionary = t => ({
  [t('dashboard.pictures')]: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  [t('dashboard.files')]: ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'],
  [t('dashboard.videos')]: ['mp4', 'wmv', 'avi'],
  [t('dashboard.soundFiles')]: ['mp3'],
})

export const iconForExtentionDictionary = t => ({
  [t('dashboard.pictures')]: markRaw(IconImage),
  [t('dashboard.files')]: markRaw(IconDoc),
  [t('dashboard.videos')]: markRaw(IconFilm),
  [t('dashboard.soundFiles')]: markRaw(IconMusic),
})
