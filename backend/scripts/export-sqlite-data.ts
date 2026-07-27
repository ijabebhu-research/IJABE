import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const data = {
    adminUsers: await prisma.adminUser.findMany(),
    mediaAssets: await prisma.mediaAsset.findMany(),
    staticPages: await prisma.staticPage.findMany(),
    siteSettings: await prisma.siteSetting.findMany(),
    issues: await prisma.issue.findMany(),
    publications: await prisma.publication.findMany(),
    newsPosts: await prisma.newsPost.findMany(),
    events: await prisma.event.findMany(),
    conferenceApplications: await prisma.conferenceApplication.findMany(),
    contactInquiries: await prisma.contactInquiry.findMany(),
    galleryItems: await prisma.galleryItem.findMany(),
    downloads: await prisma.download.findMany(),
  }

  const exportDirectory = path.resolve(process.cwd(), 'data')
  await mkdir(exportDirectory, { recursive: true })
  const exportPath = path.join(exportDirectory, 'local-export.json')
  await writeFile(exportPath, JSON.stringify(data, null, 2), 'utf8')
  console.log(`Local content exported to ${exportPath}`)
}

main().finally(() => prisma.$disconnect())
