export default function isDownloadable(path) {
  return path == '.' || path == '..' ? false : true
}
