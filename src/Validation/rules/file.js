/**
 * Convert byts to diffirents sizes types.
 * @param {number} bytes
 */
export function bytesToSize (bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

/**
 * Get extension file.
 * @param {file} file.
 */
export function getFileExtension (file) {
  const filenameParts = file.name.split('.')
  return filenameParts[filenameParts.length - 1].toLowerCase()
}

/**
 * Validate by types.
 * @param {file} file .file object.
 * @param {array} allowedFileTypes list allowed types file.
 */
export function types (file, allowedFileTypes) {
  if (!allowedFileTypes.includes(getFileExtension(file))) {
    return false
  }
  return true
}

/**
 * Validate by size.
 * @param {file} file .file object.
 * @param {number} maxFileSize max size file.
 */
export function maxsize (file, maxFileSize) {
  const maxSize = parseFloat(maxFileSize) * 1024 * 1024

  if (file.size > maxSize) {
    return false
  }
  return true
}
