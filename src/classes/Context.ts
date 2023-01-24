import { webSocketService } from '@/classes/services/WebSocketService'

export class Context {
  webSocketService: webSocketService
  constructor() {
    this.webSocketService = new webSocketService()
  }
}
