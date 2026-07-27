import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_BASE_URL'] as const

for (const variable of required) {
  if (!process.env[variable]) throw new Error(`${variable} is required to move local files to R2.`)
}

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
})
const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL!.replace(/\/$/, '')

function uploadPath(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.pathname.startsWith('/uploads/') ? parsed.pathname.slice('/uploads/'.length) : undefined
  } catch {
    return url.startsWith('/uploads/') ? url.slice('/uploads/'.length) : undefined
  }
}

async function moveFile(url: string) {
  const relativePath = uploadPath(url)
  if (!relativePath) return url
  const safeRelativePath = relativePath.replaceAll('..', '')
  const buffer = await readFile(path.resolve(process.cwd(), 'uploads', safeRelativePath))
  const key = `legacy/${safeRelativePath}`
  await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key, Body: buffer }))
  return `${publicBaseUrl}/${key}`
}

async function replaceLocalUrls(value: unknown): Promise<unknown> {
  if (typeof value === 'string') return moveFile(value)
  if (Array.isArray(value)) return Promise.all(value.map(replaceLocalUrls))
  if (value && typeof value === 'object') {
    const entries = await Promise.all(Object.entries(value).map(async ([key, entry]) => [key, await replaceLocalUrls(entry)]))
    return Object.fromEntries(entries)
  }
  return value
}

async function main() {
  for (const issue of await prisma.issue.findMany({ where: { coverImageUrl: { not: null } } })) {
    const coverImageUrl = await moveFile(issue.coverImageUrl!)
    if (coverImageUrl !== issue.coverImageUrl) await prisma.issue.update({ where: { id: issue.id }, data: { coverImageUrl } })
  }
  for (const publication of await prisma.publication.findMany({ where: { pdfUrl: { not: null } } })) {
    const pdfUrl = await moveFile(publication.pdfUrl!)
    if (pdfUrl !== publication.pdfUrl) await prisma.publication.update({ where: { id: publication.id }, data: { pdfUrl } })
  }
  for (const asset of await prisma.mediaAsset.findMany()) {
    const fileUrl = await moveFile(asset.fileUrl)
    if (fileUrl !== asset.fileUrl) await prisma.mediaAsset.update({ where: { id: asset.id }, data: { fileUrl } })
  }
  for (const item of await prisma.galleryItem.findMany()) {
    const imageUrl = await moveFile(item.imageUrl)
    if (imageUrl !== item.imageUrl) await prisma.galleryItem.update({ where: { id: item.id }, data: { imageUrl } })
  }
  for (const download of await prisma.download.findMany()) {
    const fileUrl = await moveFile(download.fileUrl)
    if (fileUrl !== download.fileUrl) await prisma.download.update({ where: { id: download.id }, data: { fileUrl } })
  }
  for (const setting of await prisma.siteSetting.findMany()) {
    try {
      const originalValue = JSON.parse(setting.value) as unknown
      const value = await replaceLocalUrls(originalValue)
      const updatedValue = JSON.stringify(value)
      if (updatedValue !== setting.value) await prisma.siteSetting.update({ where: { id: setting.id }, data: { value: updatedValue } })
    } catch {
      const value = await moveFile(setting.value)
      if (value !== setting.value) await prisma.siteSetting.update({ where: { id: setting.id }, data: { value } })
    }
  }
  console.log('Referenced PDF and image files moved to R2. Re-upload any file not stored under backend/uploads.')
}

main().finally(() => prisma.$disconnect())
