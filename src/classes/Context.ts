import { WebSocketService } from '@/classes/services/WebSocketService'

export class Context {
  webSocketService: WebSocketService
  constructor() {
    this.webSocketService = new WebSocketService()
  }
}
