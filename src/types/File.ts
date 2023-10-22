interface File {
  type?: string
  name: string
  filename: string
  size: number
  date_epoch: number
  dir?: false
  bytes?: string
  filepath?: string
  path?: string
}

export default File
