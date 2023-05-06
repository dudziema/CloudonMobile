import MessageCommands from '@/types/MessageCommands'
import MessageTypes from '@/types/MessageTypes'
import MessageSent from '@/types/MessageSent'
import MessageReceived from '@/types/message-received/MessageReceived'
import MessageDownload from '@/types/message-received/MessageDownload'
import MessageListFiles from '@/types/message-received/MessageListFiles'
import File from '@/types/File'
import ContentType from '@/types/ContentType'
import base64ToArrayBuffer from '@/utils/helpers/base64ToArrayBuffer'
import { extentionsDictionary } from '@/utils/extentionsDictionary'
import { Buffer } from 'buffer'

export class WebSocketService {
  fileList = [] as File[]
  wsOnMessageListeners: ((obj: MessageReceived) => void)[] = []
  private ws: WebSocket | undefined
  private passCode: number | undefined
  private wsOnMessageListenersListFiles: ((listfiles: File[]) => void) | null = null
  wsOnErrorListener!: () => void

  onOpen = () => {
    console.log('WS opened')
    this.sendMsgToWs({
      type: MessageTypes.LOGING_WITH_CODE,
      code: this.passCode,
    })
  }

  onMessage = (event: MessageEvent<string>) => {
    this.parseMessage(JSON.parse(event.data))
  }

  onError = (error: Event) => {
    this.wsOnErrorListener()
    console.log(error)
    this.ws?.close()
  }

  onClose = (event: Event) => {
    console.log('socket closed' + JSON.stringify(event))
  }
  
  login(passCode: number, errorMethod: () => void) {
    this.wsOnErrorListener = errorMethod
    console.log('Starting connection to WebSocket Server')
    this.passCode = passCode
    this.ws = new WebSocket('wss://cloudon.cc:9292/')
    this.ws.onopen = this.onOpen
    this.ws.onmessage = this.onMessage
    this.ws.onerror = this.onError
    this.ws.onclose = this.onClose
  }

  downloadFile(fileName: string) {
    this.sendMsgToWs({
      type: MessageTypes.FORWARD,
      command: MessageCommands.DOWNLOAD,
      path: fileName,
    })
  }

  deleteFile(fileName: string) {
    this.sendMsgToWs({
      type: MessageTypes.FORWARD,
      command: MessageCommands.REMOVE,
      path: fileName,
    })
    this.wsListFiles()
  }

  sendFile(file: File) {
    const reader: FileReader = new FileReader()
    const blob = new Blob([file as unknown as BlobPart], { type: ContentType.OCTET_STREAM })
    reader.readAsArrayBuffer(blob)
        
    reader.onloadend = () => {
      if (reader.readyState === FileReader.DONE) {
        const data = reader.result as string
        const base64String = Buffer.from(data).toString('base64')
        this.wsUploadFile(file.name, file.size, base64String)
      }
    }
  }
  
  disconnect() {
    this.ws?.close()
  }

  addWsOnMessageListener( listenerFunction: ((obj: MessageReceived) => void) ) {
    this.wsOnMessageListeners.push(listenerFunction)
  }

  private sendMsgToWs(msg: MessageSent) {
    this.ws?.send(JSON.stringify(msg))
  }

  private getFileType(fileName: string) {
    const extension = fileName.split('.').pop() || ''

    for (const [type, extensions] of Object.entries(extentionsDictionary)) {
      if (extensions.includes(extension)) {
        return type
      }
    }

    return 'Files'
  }

  private parseListFiles(obj: { payload: File[] }) {
    this.fileList = obj.payload.map(file => {
      return {
        ...file,
        type: this.getFileType(file.filename)
      }
    })

    if (this.wsOnMessageListenersListFiles) {
      this.wsOnMessageListenersListFiles(this.fileList)
    }
  }

  private saveByteArray(fileName: string | undefined, decodedBytes: Uint8Array) {
    const mimeType = ContentType.OCTET_STREAM
    const blob = new Blob([decodedBytes], { type: mimeType })
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)

    if(fileName) {
      link.download = fileName
      link.click()
    }
  }

  private isFileArray(files: File | File[]): files is File[] {
    return Array.isArray(files)
  }

  private onDownloadedFileFromPhone(message: MessageDownload) {
    debugger

    if(message.payload) {
      if(this.isFileArray(message.payload)) {
        message.payload.forEach(file => {
          this.saveByteArray(file.filename, base64ToArrayBuffer(file.bytes))
        })

      } else {
        this.saveByteArray(message.payload.filename, base64ToArrayBuffer(message.payload.bytes))
      }
    }
  }

  private parseMessage(receivedMessage: MessageReceived ) {

    if (receivedMessage.type === MessageTypes.LOGING_WITH_CODE) {
      if (this.wsOnMessageListeners) {
        this.wsOnMessageListeners.forEach(listener => {
          listener(receivedMessage)
        })
      }
    }
    const messageCommand: MessageCommands | undefined = receivedMessage.command

    switch (messageCommand) {
    case MessageCommands.DOWNLOAD:
      let messageDownload = receivedMessage as MessageDownload
  
      if(messageDownload) {
        this.onDownloadedFileFromPhone(messageDownload)
      }
      break
    case MessageCommands.UPLOAD:
      this.wsListFiles()
      break
    case MessageCommands.LIST_FILES:
      let messageListFiles = receivedMessage as MessageListFiles
  
      if(messageListFiles) {
        this.parseListFiles(messageListFiles)
      }
      break
    }
  }

  private wsUploadFile(filename: string | undefined, size: number, base64String: string) {
    this.ws?.send(JSON.stringify({
      type: MessageTypes.FORWARD,
      command: MessageCommands.UPLOAD,
      payload: { filepath: filename, path: '', size: size, bytes: base64String },
    }))
  }

  private wsListFiles(func?: () => void) {
    if (func) this.wsOnMessageListenersListFiles = func
    this.ws?.send(
      JSON.stringify({
        type: MessageTypes.FORWARD,
        command: MessageCommands.LIST_FILES,
      })
    )
  }
}
