import { WebSocketService } from './services/WebSocketService'
import { ModalService } from './services/ModalService'

export class Context {
  webSocketService: WebSocketService
  modalService: ModalService

  constructor() {
    this.webSocketService = new WebSocketService()
    this.modalService = new ModalService()
  }
}
