import router from '@/router'
import Message from '@/types/Message'
import MessageCommands from '@/types/MessageCommands'
import MessageTypes from '@/types/MessageTypes'
import File from '@/types/File'
import base64ToArrayBuffer from '@/utils/helpers/base64ToArrayBuffer'
import { useRouter } from 'vue-router'
import { Buffer } from 'buffer'

export class webSocketService {
  private ws = {} as WebSocket
  private shouldDisconnect = false
  private readonly router = useRouter()
  listFiles = [] as File[]

  private wsOnMessageListenersListFiles: ((listfiles: File[]) => void) | null =
    null
  constructor() {
    console.log('Starting connection to WebSocket Server')
    this.ws = new WebSocket('wss://cloudon.cc:9292/')

    this.ws.onopen = () => {
      console.log('WS opened')
    }

    this.ws.onmessage = event => {
      let received_message: string = event.data
      this.parseMessage(received_message)
    }
  }

  login(passCode: number) {
    this.sendMsgToWs({
      type: MessageTypes.LOGGING_WITH_CODE,
      code: passCode,
    })
  }

  sendMsgToWs(msg: Message) {
    this.ws.send(JSON.stringify(msg))
  }

  private saveByteArray(fileName: string, decodedBytes: Uint8Array) {
    let mimeType = 'application/octet-stream'
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

  parseListFiles(obj: { payload: File[] }) {
    this.listFiles = obj.payload

    if (this.wsOnMessageListenersListFiles != null) {
      this.wsOnMessageListenersListFiles(this.listFiles)
    }
  }

  private parseMessage(received_msg: string) {
    let obj = JSON.parse(received_msg)

    if (obj.type === MessageTypes.LOGGING_WITH_CODE) {
      if (obj.result === 0) {
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
  sendFile(file: File) {
    const reader: FileReader = new FileReader()
    const blob = new Blob([file as unknown as BlobPart], { type: 'application/octet-stream' })
    reader.readAsArrayBuffer(blob)
        
    reader.onloadend = () => {
      if (reader.readyState === FileReader.DONE) {
        let data = reader.result as string
        let base64String = Buffer.from(data).toString('base64')
        this.wsUploadFile(file.name, file.size, base64String)
      }
    }
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
