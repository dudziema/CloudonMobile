// When user click log in button

//Open WebSockets

let webSocketsService = {}
let ws = null
let shouldDisconnect = false

export class WebSocketConnect {
  constructor(successHandler, failureHandler) {
    console.log('Starting connection to WebSocket Server')
    ws = new WebSocket('wss://cloudon.cc:9292/')
    this.ws = ws

    // Open connection
    ws.onopen = () => {
      shouldDisconnect = false
      successHandler()
    }

    // Parse message
    ws.onmessage = event => {
      let received_message = event.data
      // parseMessage(received_message);
    }

    // Close connection
    ws.onclose = event => {
      console.log('socket closed' + JSON.stringify(event))

      if (shouldDisconnect === false) {
        failureHandler()
      }
    }

    // Error handling
    ws.onerror = error => {
      console.log(error)
      ws.close()
    }
  }
}

webSocketsService.install = function () {
  const webSocketConnect = new WebSocketConnect()
}
