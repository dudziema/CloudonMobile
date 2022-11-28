import { webSocketService } from '@/classes/services/WebSocketService'

export class Context {
  webSocketService: any
  constructor() {
    this.webSocketService = new webSocketService()
  }
}
