import File from '@/types/File'
import MessageCommands from '@/types/MessageCommands'
import MessageTypes from './MessageTypes'

interface MessageSent {
  type: MessageTypes
  code?: number
  command?: MessageCommands
  path?: string
}

export default MessageSent
