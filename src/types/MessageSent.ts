import MessageCommands from '@/types/MessageCommands'
import MessageTypes from '@/types/MessageTypes'

import type { File } from '@/types/File'

interface MessageSent {
  type: MessageTypes
  code?: number
  command?: MessageCommands
  path?: string
  payload?: File
}

export default MessageSent
