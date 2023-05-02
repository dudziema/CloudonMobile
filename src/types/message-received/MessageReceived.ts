import MessageCommands from '@/types/MessageCommands'
import MessageTypes from '@/types/MessageTypes'

interface MessageReceived {
  type: MessageTypes
  command: MessageCommands
}

export default MessageReceived
