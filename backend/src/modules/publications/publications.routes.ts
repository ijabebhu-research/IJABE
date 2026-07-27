import { Router } from 'express'

import {
  filterPublications,
  getPublicationBySlug,
} from '../admin/admin-content.store.js'

const publicationsRouter = Router()

publicationsRouter.get('/', async (request, response) => {
  const searchQuery = String(request.query.q ?? '').trim().toLowerCase()
  const issueSlug = String(request.query.issue ?? '').trim().toLowerCase()
  const filteredPublications = await filterPublications(searchQuery, issueSlug)

  response.status(200).json({
    success: true,
    message: 'Publications fetched successfully',
    data: filteredPublications,
  })
})

publicationsRouter.get('/:slug', async (request, response) => {
  const publication = await getPublicationBySlug(request.params.slug)

  if (!publication) {
    response.status(404).json({
      success: false,
      message: 'Publication not found',
    })
    return
  }

  response.status(200).json({
    success: true,
    message: 'Publication fetched successfully',
    data: publication,
  })
})

export { publicationsRouter }
