import File from '@/types/File'
import MessageCommands from '@/types/MessageCommands'

interface Message {
  type: string
  code?: number
  payload?: File
  command?: MessageCommands
  path?: string
}

export default Message
