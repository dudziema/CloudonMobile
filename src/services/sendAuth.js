export default webSocketsSendAuth = (code) => {
  let msg = { type: "web-loging-with-code", code: code };
  ws.send(JSON.stringify(msg));
};