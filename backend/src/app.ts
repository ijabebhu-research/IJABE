import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'node:path'

import { env } from './config/env.js'
import { errorHandler } from './middleware/error-handler.js'
import { notFoundHandler } from './middleware/not-found.js'
import { apiRouter } from './routes/index.js'

export function createApp() {
  const app = express()
  app.set('trust proxy', 1)

  app.use(
    cors({
      origin(origin, callback) {
        const isConfiguredFrontend = env.frontendUrls.includes(origin ?? '')
        const isLocalDevelopmentFrontend =
          env.NODE_ENV !== 'production' &&
          /^http:\/\/localhost:\d+$/.test(origin ?? '')

        callback(null, !origin || isConfiguredFrontend || isLocalDevelopmentFrontend)
      },
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '28mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')))

  app.get('/', (_request, response) => {
    response.status(200).json({
      success: true,
      message: 'IJABE backend foundation ready',
    })
  })

  app.use('/api', apiRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
