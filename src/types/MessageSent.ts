import MessageCommands from '@/types/MessageCommands'
import MessageTypes from './MessageTypes'
import File from '@/types/File'
interface MessageSent {
  type: MessageTypes
  code?: number
  command?: MessageCommands
  path?: string
  payload?: File
}

export default MessageSent
