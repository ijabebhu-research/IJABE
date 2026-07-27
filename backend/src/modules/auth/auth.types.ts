import type { Request } from 'express'

export type AuthTokenPayload = {
  sub: string
  email: string
  role: 'ADMIN'
  type: 'access' | 'refresh'
}

export type AuthenticatedRequest = Request & {
  auth?: AuthTokenPayload
}
