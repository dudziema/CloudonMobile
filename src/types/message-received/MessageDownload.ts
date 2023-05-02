import File from '@/types/File'
import MessageReceived from './MessageReceived'

interface MessageDownload extends MessageReceived {
  payload: File
}

export default MessageDownload
