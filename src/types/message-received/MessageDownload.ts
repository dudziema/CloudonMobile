import type { File } from '@/types/File'
import type { MessageReceived } from './MessageReceived'

export interface MessageDownload extends MessageReceived {
  payload: File
}
