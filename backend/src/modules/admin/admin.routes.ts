import { Router } from 'express'
import { z } from 'zod'

import { requireAuth } from '../../middleware/require-auth.js'
import { prisma } from '../../config/prisma.js'
import type { AuthenticatedRequest } from '../auth/auth.types.js'
import {
  getAdminContentSnapshot,
  getAdminDashboardSummary,
  updateAdminContentSnapshot,
} from './admin-content.store.js'

const metricSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(40),
})

const staticPageSectionSchema = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(5000),
  bulletPoints: z.array(z.string().trim().min(1).max(160)).optional(),
})

const staticPageSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  eyebrow: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(1500),
  sections: z.array(staticPageSectionSchema).min(1),
})

const issueSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  volume: z.number().int().nonnegative(),
  issueNumber: z.number().int().nonnegative(),
  publicationDate: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(1500),
  isCurrent: z.boolean(),
})

const publicationSchema = z.object({
  slug: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(240),
  abstract: z.string().trim().min(1).max(5000),
  authors: z.array(z.string().trim().min(1).max(120)).min(1),
  keywords: z.array(z.string().trim().min(1).max(80)).min(1),
  publishedAt: z.string().trim().min(1).max(80),
  issueSlug: z.string().trim().min(1).max(120),
  pdfUrl: z.string().trim().max(500),
  doi: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(120),
})

const newsSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(240),
  excerpt: z.string().trim().min(1).max(1500),
  category: z.string().trim().min(1).max(120),
  publishedAt: z.string().trim().min(1).max(80),
})

const eventSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(240),
  summary: z.string().trim().min(1).max(2000),
  venue: z.string().trim().min(1).max(160),
  startsAt: z.string().trim().min(1).max(80),
  status: z.enum(['Upcoming', 'Completed']),
})

const gallerySchema = z.object({
  id: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().min(1).max(1000),
})

const downloadSchema = z.object({
  id: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(1500),
  category: z.string().trim().min(1).max(120),
  fileUrl: z.string().trim().min(1).max(1000),
  fileSize: z.string().trim().min(1).max(80),
})

const contactSchema = z.object({
  officeName: z.string().trim().min(1).max(160),
  email: z.string().trim().email(),
  supportEmail: z.string().trim().email(),
  phone: z.string().trim().min(1).max(80),
  address: z.string().trim().min(1).max(240),
  officeHours: z.string().trim().min(1).max(160),
})

const brandingSchema = z.object({
  universityLogoUrl: z.string().trim().min(1).max(1000),
  journalLogoUrl: z.string().trim().min(1).max(1000),
  heroBannerUrl: z.string().trim().min(1).max(1000),
  issn: z.string().trim().max(80),
})

const profileSchema = z.object({
  id: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(2000),
  imageUrl: z.string().trim().min(1).max(1000),
})

const editorialBoardMemberSchema = z.object({
  id: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(160),
  role: z.string().trim().min(1).max(160),
  affiliation: z.string().trim().min(1).max(240),
  summary: z.string().trim().min(1).max(2000),
  imageUrl: z.string().trim().min(1).max(1000),
})

const adminContentSnapshotSchema = z
  .object({
    homepage: z.object({
      heroTitle: z.string().trim().min(1).max(240),
      heroSummary: z.string().trim().min(1).max(2000),
      metrics: z.array(metricSchema).min(1),
    }),
    pages: z.array(staticPageSchema).min(1),
    publications: z.array(publicationSchema),
    issues: z.array(issueSchema),
    news: z.array(newsSchema),
    events: z.array(eventSchema),
    gallery: z.array(gallerySchema),
    downloads: z.array(downloadSchema),
    contact: contactSchema,
    branding: brandingSchema,
    leadership: z.object({
      viceChancellor: profileSchema,
      universityManagement: profileSchema,
      researchUnitHead: profileSchema,
    }),
    editorialBoardMembers: z.array(editorialBoardMemberSchema),
  })
  .superRefine((value, context) => {
    const currentIssues = value.issues.filter((issue) => issue.isCurrent)

    if (currentIssues.length !== 1) {
      context.addIssue({
        code: 'custom',
        message: 'Exactly one issue must be marked as current.',
        path: ['issues'],
      })
    }

    const issueSlugs = new Set(value.issues.map((issue) => issue.slug))

    value.publications.forEach((publication, index) => {
      if (!issueSlugs.has(publication.issueSlug)) {
        context.addIssue({
          code: 'custom',
          message: 'Each publication must reference an existing issue slug.',
          path: ['publications', index, 'issueSlug'],
        })
      }
    })
  })

const adminRouter = Router()

adminRouter.use(requireAuth)

adminRouter.get('/dashboard', async (request: AuthenticatedRequest, response) => {
  const summary = await getAdminDashboardSummary()
  response.status(200).json({
    success: true,
    message: 'Admin dashboard summary fetched successfully',
    data: {
      user: request.auth,
      summary,
    },
  })
})

adminRouter.get('/content', async (_request, response) => {
  const snapshot = await getAdminContentSnapshot()
  response.status(200).json({
    success: true,
    message: 'Admin content snapshot fetched successfully',
    data: snapshot,
  })
})

adminRouter.get('/applicants', async (_request, response) => {
  const applicants = await prisma.conferenceApplication.findMany({ orderBy: { createdAt: 'desc' } })
  response.status(200).json({ success: true, message: 'Applicants fetched successfully', data: applicants })
})

adminRouter.patch('/applicants/:id', async (request, response) => {
  const status = z.enum(['NEW', 'REVIEWED', 'RESPONDED']).parse(request.body.status)
  const applicant = await prisma.conferenceApplication.update({ where: { id: request.params.id }, data: { status } })
  response.status(200).json({ success: true, message: 'Applicant updated successfully', data: applicant })
})

adminRouter.delete('/applicants/:id', async (request, response) => {
  await prisma.conferenceApplication.delete({ where: { id: request.params.id } })
  response.status(204).send()
})

adminRouter.get('/enquiries', async (_request, response) => {
  const enquiries = await prisma.contactInquiry.findMany({ orderBy: { createdAt: 'desc' } })
  response.status(200).json({ success: true, message: 'Enquiries fetched successfully', data: enquiries })
})

adminRouter.delete('/enquiries/:id', async (request, response) => {
  await prisma.contactInquiry.delete({ where: { id: request.params.id } })
  response.status(204).send()
})

adminRouter.put('/content', async (request: AuthenticatedRequest, response) => {
  const parsedSnapshot = adminContentSnapshotSchema.parse(request.body)
  const updatedSnapshot = await updateAdminContentSnapshot(parsedSnapshot)

  response.status(200).json({
    success: true,
    message: 'Admin content snapshot updated successfully',
    data: updatedSnapshot,
  })
})

export { adminRouter }
