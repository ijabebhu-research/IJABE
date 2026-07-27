import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { env } from '../../config/env.js'
import type { AuthTokenPayload } from './auth.types.js'

export const ACCESS_COOKIE_NAME = 'ijabe_access_token'
export const REFRESH_COOKIE_NAME = 'ijabe_refresh_token'

type TokenSubject = {
  id: string
  email: string
  role: 'ADMIN'
}

export function createAccessToken(subject: TokenSubject) {
  return jwt.sign(
    { email: subject.email, role: subject.role, type: 'access' },
    env.JWT_ACCESS_SECRET,
    {
      subject: subject.id,
      expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions['expiresIn'],
    },
  )
}

export function createRefreshToken(subject: TokenSubject) {
  return jwt.sign(
    { email: subject.email, role: subject.role, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    {
      subject: subject.id,
      expiresIn: env.REFRESH_TOKEN_TTL as jwt.SignOptions['expiresIn'],
    },
  )
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthTokenPayload
}

export async function hashToken(token: string) {
  return bcrypt.hash(token, 10)
}

export async function compareTokenHash(token: string, hashedToken: string) {
  return bcrypt.compare(token, hashedToken)
}
