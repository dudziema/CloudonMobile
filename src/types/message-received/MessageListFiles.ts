import File from '@/types/File'
import MessageReceived from '@/types/message-received/MessageReceived'

interface MessageListFiles extends MessageReceived {
  payload: File[]
}

export default MessageListFiles
