import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { env } from '../../config/env.js'

type StoredFile = {
  buffer: Buffer
  category: 'images' | 'publications'
  extension: string
  fileName: string
  mimeType: string
}

let r2Client: S3Client | undefined

function createSafeFileName(fileName: string, extension: string) {
  const baseName = path.basename(fileName, path.extname(fileName)).replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 100) || 'file'
  return `${Date.now()}-${crypto.randomUUID()}-${baseName}.${extension}`
}

function getR2Client() {
  if (!r2Client) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID!,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
      },
    })
  }

  return r2Client
}

export async function storeUpload(file: StoredFile) {
  const storedFileName = createSafeFileName(file.fileName, file.extension)
  const objectKey = `${file.category}/${storedFileName}`

  if (env.STORAGE_PROVIDER === 'r2') {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET!,
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.mimeType,
      }),
    )

    return `${env.R2_PUBLIC_BASE_URL!.replace(/\/$/, '')}/${objectKey}`
  }

  const uploadDirectory = path.resolve(process.cwd(), 'uploads', file.category)
  await mkdir(uploadDirectory, { recursive: true })
  await writeFile(path.join(uploadDirectory, storedFileName), file.buffer)

  return `/uploads/${objectKey}`
}
