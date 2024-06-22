import type { File } from '@/types/File'
import type { MessageReceived } from '@/types/message-received/MessageReceived'

export interface MessageListFiles extends MessageReceived {
  payload: File[]
}
