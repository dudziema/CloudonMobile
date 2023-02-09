import File from '@/types/File'
import MessageCommands from '@/types/MessageCommands'
import MessageTypes from '@/types/MessageTypes'

interface MessageReceived {
  type: MessageTypes
  result?: number
  message?: string
  command?: MessageCommands
  payload?: File[] | File
  filepath?: string
}

export default MessageReceived
