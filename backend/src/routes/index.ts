import { Router } from 'express'

import { adminRouter } from '../modules/admin/admin.routes.js'
import { authRouter } from '../modules/auth/auth.routes.js'
import { issuesRouter } from '../modules/issues/issues.routes.js'
import { publicationsRouter } from '../modules/publications/publications.routes.js'
import { publicRouter } from '../modules/public/public.routes.js'
import { siteSettingsRouter } from '../modules/site-settings/site-settings.routes.js'
import { uploadsRouter } from '../modules/uploads/uploads.routes.js'

const apiRouter = Router()

apiRouter.get('/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'IJABE backend foundation is running',
    data: {
      version: '0.1.0',
        modules: ['admin', 'auth', 'issues', 'publications', 'public', 'site-settings'],
    },
  })
})

apiRouter.use('/admin', adminRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/issues', issuesRouter)
apiRouter.use('/publications', publicationsRouter)
apiRouter.use('/public', publicRouter)
apiRouter.use('/site-settings', siteSettingsRouter)
apiRouter.use('/uploads', uploadsRouter)

export { apiRouter }
