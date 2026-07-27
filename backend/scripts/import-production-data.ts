import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { PrismaClient } from '@prisma/client'

type ExportedData = Record<string, Array<Record<string, unknown>>>

const prisma = new PrismaClient()

async function addMany(model: { createMany(args: { data: Array<Record<string, unknown>>; skipDuplicates: boolean }): Promise<unknown> }, records: Array<Record<string, unknown>>) {
  if (records.length > 0) await model.createMany({ data: records, skipDuplicates: true })
}

async function main() {
  const exportPath = path.resolve(process.cwd(), 'data', 'local-export.json')
  const data = JSON.parse(await readFile(exportPath, 'utf8')) as ExportedData

  await addMany(prisma.adminUser, data.adminUsers ?? [])
  await addMany(prisma.mediaAsset, data.mediaAssets ?? [])
  await addMany(prisma.staticPage, data.staticPages ?? [])
  await addMany(prisma.siteSetting, data.siteSettings ?? [])
  await addMany(prisma.issue, data.issues ?? [])
  await addMany(prisma.publication, data.publications ?? [])
  await addMany(prisma.newsPost, data.newsPosts ?? [])
  await addMany(prisma.event, data.events ?? [])
  await addMany(prisma.conferenceApplication, data.conferenceApplications ?? [])
  await addMany(prisma.contactInquiry, data.contactInquiries ?? [])
  await addMany(prisma.galleryItem, data.galleryItems ?? [])
  await addMany(prisma.download, data.downloads ?? [])

  console.log('Local content imported into the production database.')
}

main().finally(() => prisma.$disconnect())
