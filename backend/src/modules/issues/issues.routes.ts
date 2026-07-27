import { Router } from 'express'

import {
  getArchiveIssuesWithCounts,
  getCurrentIssueWithPublications,
  getIssueBySlugWithPublications,
} from '../admin/admin-content.store.js'

const issuesRouter = Router()

issuesRouter.get('/current', async (_request, response) => {
  const currentIssue = await getCurrentIssueWithPublications()

  response.status(200).json({
    success: true,
    message: 'Current issue fetched successfully',
    data: currentIssue,
  })
})

issuesRouter.get('/archives', async (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'Archive issues fetched successfully',
    data: await getArchiveIssuesWithCounts(),
  })
})

issuesRouter.get('/:slug', async (request, response) => {
  const issue = await getIssueBySlugWithPublications(request.params.slug)

  if (!issue) {
    response.status(404).json({ success: false, message: 'Issue not found' })
    return
  }

  response.status(200).json({
    success: true,
    message: 'Issue and published articles fetched successfully',
    data: issue,
  })
})

export { issuesRouter }
