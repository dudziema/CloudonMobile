interface ModalConfig {
  title: string,
  description: string,
  buttonAction: {
    text: string,
    callback: () => void,
  }
}

export default ModalConfig
