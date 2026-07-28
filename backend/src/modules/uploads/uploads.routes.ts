import { Router } from 'express'
import { z } from 'zod'

import { requireAuth } from '../../middleware/require-auth.js'
import { storeUpload } from './storage.service.js'

const uploadSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.literal('application/pdf'),
  base64: z.string().min(1),
})

const imageUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  base64: z.string().min(1),
})

const uploadsRouter = Router()
uploadsRouter.use(requireAuth)

uploadsRouter.post('/publication', async (request, response) => {
  const file = uploadSchema.parse(request.body)
  const buffer = Buffer.from(file.base64, 'base64')
  if (buffer.length > 20 * 1024 * 1024 || buffer.subarray(0, 4).toString() !== '%PDF') {
    response.status(400).json({ success: false, message: 'Upload a valid PDF smaller than 20 MB.' })
    return
  }

  const fileUrl = await storeUpload({
    buffer,
    category: 'publications',
    extension: 'pdf',
    fileName: file.fileName,
    mimeType: file.mimeType,
  })

  response.status(201).json({ success: true, message: 'Publication uploaded successfully', data: { fileUrl: toPublicUrl(request, fileUrl) } })
})

uploadsRouter.post('/image', async (request, response) => {
  const file = imageUploadSchema.parse(request.body)
  const buffer = Buffer.from(file.base64, 'base64')
  if (buffer.length > 5 * 1024 * 1024) {
    response.status(400).json({ success: false, message: 'Upload an image smaller than 5 MB.' })
    return
  }
  const extension = file.mimeType === 'image/png' ? 'png' : file.mimeType === 'image/webp' ? 'webp' : 'jpg'
  const fileUrl = await storeUpload({
    buffer,
    category: 'images',
    extension,
    fileName: file.fileName,
    mimeType: file.mimeType,
  })
  response.status(201).json({ success: true, message: 'Image uploaded successfully', data: { fileUrl: toPublicUrl(request, fileUrl) } })
})

function toPublicUrl(request: { protocol: string; get(name: string): string | undefined }, fileUrl: string) {
  if (fileUrl.startsWith('http')) return fileUrl
  return `${request.protocol}://${request.get('host')}${fileUrl}`
}

export { uploadsRouter }
