import { Router } from 'express'

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

export { publicRouter }
