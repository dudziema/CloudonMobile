import router from '@/router'
import Message from '@/types/Message'
import MessageCommands from '@/types/MessageCommands'
import MessageTypes from '@/types/MessageTypes'
import File from '@/types/File'
import ContentType from '@/types/ContentType'
import base64ToArrayBuffer from '@/utils/helpers/base64ToArrayBuffer'
import { useRouter } from 'vue-router'
import { Buffer } from 'buffer'

export class WebSocketService {
  listFiles = [] as File[]
  private ws: WebSocket
  private readonly router = useRouter()
  private wsOnMessageListenersListFiles: ((listfiles: File[]) => void) | null = null

  constructor() {
    console.log('Starting connection to WebSocket Server')
    this.ws = new WebSocket('wss://cloudon.cc:9292/')

    this.ws.onopen = () => {
      console.log('WS opened')
    }

    this.ws.onmessage = event => {
      let receivedMessage: string = event.data
      this.parseMessage(receivedMessage)
    }
  }

  login(passCode: number) {
    this.sendMsgToWs({
      type: MessageTypes.LOGING_WITH_CODE,
      code: passCode,
    })
  }

  downloadFile(fileName: string) {
    let msg: Message = {
      type: MessageTypes.FORWARD,
      command: MessageCommands.DOWNLOAD,
      path: fileName,
    }
    this.sendMsgToWs(msg)
  }

  deleteFile(fileName: string) {
    let msg = {
      type: MessageTypes.FORWARD,
      command: MessageCommands.REMOVE,
      path: fileName,
    }
    this.sendMsgToWs(msg)
    this.wsListFiles()
  }

  sendFile(file: File) {
    const reader: FileReader = new FileReader()
    const blob = new Blob([file as unknown as BlobPart], { type: ContentType.OCTET_STREAM })
    reader.readAsArrayBuffer(blob)
        
    reader.onloadend = () => {
      if (reader.readyState === FileReader.DONE) {
        let data = reader.result as string
        let base64String = Buffer.from(data).toString('base64')
        this.wsUploadFile(file.name, file.size, base64String)
      }
    }
  }

  private sendMsgToWs(msg: Message) {
    this.ws.send(JSON.stringify(msg))
  }

  private parseListFiles(obj: { payload: File[] }) {
    this.listFiles = obj.payload

    if (this.wsOnMessageListenersListFiles) {
      this.wsOnMessageListenersListFiles(this.listFiles)
    }
  }

  private saveByteArray(fileName: string, decodedBytes: Uint8Array) {
    let mimeType = ContentType.OCTET_STREAM
    const blob = new Blob([decodedBytes], { type: mimeType })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
  }

  private onDownloadedFileFromPhone(message: Message) {
    if(message.payload) {
      let decodedBytes = base64ToArrayBuffer(message.payload.bytes)
      this.saveByteArray(message.payload.filename, decodedBytes)
    }
  }

  private parseMessage(receivedMessage: string) {
    let obj = JSON.parse(receivedMessage)

    if (obj.type === MessageTypes.LOGING_WITH_CODE) {
      if (!obj.result) {
        router.push('/dashboard')
      }
    }
    let message: MessageCommands = obj.command

    switch (message) {
    case MessageCommands.DOWNLOAD:
      this.onDownloadedFileFromPhone(obj)
      break
    case MessageCommands.UPLOAD:
      this.wsListFiles()
      break
    case MessageCommands.LIST_FILES:
      this.parseListFiles(obj)
      break
    }
  }

  private wsUploadFile(filename: string, size: number, base64String: string) {
    let msg = {
      type: MessageTypes.FORWARD,
      command: MessageCommands.UPLOAD,
      payload: { filepath: filename, path: '', size: size, bytes: base64String },
    }
    this.ws.send(JSON.stringify(msg))
  }

  private wsListFiles(func?: () => void) {
    if (func) this.wsOnMessageListenersListFiles = func
    this.ws.send(
      JSON.stringify({
        type: MessageTypes.FORWARD,
        command: MessageCommands.LIST_FILES,
      })
    )
  }
}
