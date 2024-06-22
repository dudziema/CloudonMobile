import MessageCommands from '@/types/MessageCommands'
import MessageTypes from '@/types/MessageTypes'

export interface MessageReceived {
  type: MessageTypes
  command: MessageCommands
  result?: number
}
