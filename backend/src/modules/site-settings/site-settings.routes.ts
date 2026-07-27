import { Router } from 'express'
import { z } from 'zod'

import { getPublicSiteContent } from '../admin/admin-content.store.js'
import { prisma } from '../../config/prisma.js'

const siteSettingsRouter = Router()

const contactInquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(2000),
})

const conferenceApplicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(80).optional(),
  institution: z.string().trim().min(2).max(180),
  eventTitle: z.string().trim().min(2).max(240),
  message: z.string().trim().max(2000).optional(),
})

siteSettingsRouter.get('/public', async (_request, response) => {
  const publicSiteContent = await getPublicSiteContent()

  response.status(200).json({
    success: true,
    message: 'Public site content fetched successfully',
    data: publicSiteContent,
  })
})

siteSettingsRouter.post('/contact', async (request, response) => {
  const submission = contactInquirySchema.parse(request.body)
  const created = await prisma.contactInquiry.create({ data: submission })

  response.status(201).json({
    success: true,
    message: 'Contact enquiry submitted successfully',
    data: {
      reference: `IJABE-${created.id.slice(-6).toUpperCase()}`,
      receivedAt: created.createdAt.toISOString(),
    },
  })
})

siteSettingsRouter.post('/conference-applications', async (request, response) => {
  const application = conferenceApplicationSchema.parse(request.body)
  const created = await prisma.conferenceApplication.create({ data: application })

  response.status(201).json({
    success: true,
    message: 'Conference application submitted successfully',
    data: { id: created.id, reference: `IJABE-${created.id.slice(-6).toUpperCase()}` },
  })
})

export { siteSettingsRouter }
