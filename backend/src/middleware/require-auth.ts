import type { NextFunction, Response } from 'express'

import { AppError } from './app-error.js'
import type { AuthenticatedRequest } from '../modules/auth/auth.types.js'
import {
  ACCESS_COOKIE_NAME,
  verifyAccessToken,
} from '../modules/auth/auth.tokens.js'

export function requireAuth(
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction,
) {
  const bearerToken = request.headers.authorization?.startsWith('Bearer ')
    ? request.headers.authorization.replace('Bearer ', '')
    : undefined
  const cookieToken = request.cookies?.[ACCESS_COOKIE_NAME]
  const token = bearerToken ?? cookieToken

  if (!token) {
    return next(new AppError('Authentication required', 401))
  }

  try {
    request.auth = verifyAccessToken(token)
    return next()
  } catch (error) {
    return next(new AppError('Invalid or expired access token', 401, error))
  }
}
