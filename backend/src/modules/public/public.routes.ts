import { Router } from 'express'

import { prisma } from '../../config/prisma.js'
import {
  getPublicSiteContent,
} from '../admin/admin-content.store.js'

const publicRouter = Router()

publicRouter.get('/site', async (_request, response) => {
  const siteContent = await getPublicSiteContent()

  response.status(200).json({
    success: true,
    message: 'Public site content fetched successfully',
    data: siteContent,
  })
})

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] ?? character)
}

// This is served through the frontend's /sitemap.xml rewrite so search engines
// can discover every published research article without exposing an admin route.
publicRouter.get('/sitemap.xml', async (_request, response) => {
  const publications = await prisma.publication.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  })
  const siteUrl = 'https://www.ijabebhu.com'
  const pages = ['', '/about', '/research-repository', '/news', '/events', '/contact']
  const urls = [
    ...pages.map((path) => `<url><loc>${siteUrl}${path}</loc></url>`),
    ...publications.map((publication) => {
      const lastModified = publication.updatedAt.toISOString().slice(0, 10)
      return `<url><loc>${siteUrl}/research-repository/${escapeXml(publication.slug)}</loc><lastmod>${lastModified}</lastmod></url>`
    }),
  ].join('')

  response
    .status(200)
    .type('application/xml')
    .send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`)
})

export { publicRouter }
