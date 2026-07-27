import type { NextFunction, Request, Response } from 'express'

import { AppError } from './app-error.js'

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const isAppError = error instanceof AppError
  const statusCode = isAppError ? error.statusCode : 500

  if (!isAppError) {
    console.error(error)
  }

  response.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(isAppError && error.details ? { details: error.details } : {}),
  })
}
