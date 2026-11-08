import { MAX_PHOTO_BYTES } from '../constants'

const MAX_EDGE = 1600

/**
 * Re-encodes a photo as JPEG with its longest side limited to 1600px.
 * Phone pictures are often 4-8 MB; this keeps uploads small on mobile data.
 * Animated GIFs and files the browser cannot decode are returned unchanged.
 */
export async function compressPhoto(file: File): Promise<File> {
  if (file.type === 'image/gif' || !file.type.startsWith('image/')) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82))
    if (!blob || (blob.size >= file.size && file.size <= MAX_PHOTO_BYTES)) return file
    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file
  }
}
