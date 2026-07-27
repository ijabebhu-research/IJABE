import bcrypt from 'bcryptjs'
import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

import { prisma } from '../../config/prisma.js'
import { AppError } from '../../middleware/app-error.js'
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  createAccessToken,
  createRefreshToken,
  compareTokenHash,
  hashToken,
  verifyRefreshToken,
} from './auth.tokens.js'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

const accountUpdateSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.email(),
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8).max(128).optional(),
  })
  .strict()

const accessCookieMaxAge = 1000 * 60 * 60 * 8
const refreshCookieMaxAge = 1000 * 60 * 60 * 24 * 30

function getCookieConfig(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export async function login(request: Request, response: Response, next: NextFunction) {
  try {
    const parsedBody = loginSchema.safeParse(request.body)

    if (!parsedBody.success) {
      throw new AppError('Invalid login payload', 400, parsedBody.error.flatten())
    }

    const { email, password } = parsedBody.data

    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401)
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401)
    }

    const tokenSubject = { id: user.id, email: user.email, role: user.role as 'ADMIN' }
    const accessToken = createAccessToken(tokenSubject)
    const refreshToken = createRefreshToken(tokenSubject)
    const refreshTokenHash = await hashToken(refreshToken)

    await prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + refreshCookieMaxAge),
      },
    })

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    response.cookie(
      ACCESS_COOKIE_NAME,
      accessToken,
      getCookieConfig(accessCookieMaxAge),
    )
    response.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      getCookieConfig(refreshCookieMaxAge),
    )

    response.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function logout(request: Request, response: Response, next: NextFunction) {
  try {
    const refreshToken = request.cookies?.[REFRESH_COOKIE_NAME]

    if (refreshToken) {
      const allTokens = await prisma.refreshToken.findMany({
        where: { revokedAt: null },
      })

      for (const token of allTokens) {
        const isMatch = await bcrypt.compare(refreshToken, token.tokenHash)
        if (isMatch) {
          await prisma.refreshToken.update({
            where: { id: token.id },
            data: { revokedAt: new Date() },
          })
          break
        }
      }
    }

    response.clearCookie(ACCESS_COOKIE_NAME, { path: '/' })
    response.clearCookie(REFRESH_COOKIE_NAME, { path: '/' })

    response.status(200).json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    next(error)
  }
}

export async function refresh(request: Request, response: Response, next: NextFunction) {
  try {
    const refreshToken = request.cookies?.[REFRESH_COOKIE_NAME]
    if (!refreshToken) throw new AppError('Sign in is required', 401)

    const token = verifyRefreshToken(refreshToken)
    if (token.type !== 'refresh') throw new AppError('Invalid session', 401)

    const user = await prisma.adminUser.findUnique({ where: { id: token.sub } })
    if (!user || !user.isActive) throw new AppError('Sign in is required', 401)

    const activeTokens = await prisma.refreshToken.findMany({
      where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
    })
    const storedToken = await Promise.all(
      activeTokens.map(async (candidate) =>
        (await compareTokenHash(refreshToken, candidate.tokenHash)) ? candidate : null,
      ),
    ).then((matches) => matches.find(Boolean))

    if (!storedToken) throw new AppError('Your session has expired. Please sign in again.', 401)

    const subject = { id: user.id, email: user.email, role: user.role as 'ADMIN' }
    const nextRefreshToken = createRefreshToken(subject)
    await prisma.$transaction([
      prisma.refreshToken.update({ where: { id: storedToken.id }, data: { revokedAt: new Date() } }),
      prisma.refreshToken.create({
        data: {
          tokenHash: await hashToken(nextRefreshToken),
          userId: user.id,
          expiresAt: new Date(Date.now() + refreshCookieMaxAge),
        },
      }),
    ])

    response.cookie(ACCESS_COOKIE_NAME, createAccessToken(subject), getCookieConfig(accessCookieMaxAge))
    response.cookie(REFRESH_COOKIE_NAME, nextRefreshToken, getCookieConfig(refreshCookieMaxAge))
    response.status(200).json({ success: true, message: 'Session renewed', data: {} })
  } catch (error) {
    next(error)
  }
}

export async function me(request: Request, response: Response, next: NextFunction) {
  try {
    const auth = (request as Request & { auth?: { sub?: string } }).auth

    if (!auth?.sub) {
      throw new AppError('Authenticated user context is missing', 401)
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: auth.sub },
    })

    if (!user || !user.isActive) {
      throw new AppError('Authenticated user was not found', 404)
    }

    response.status(200).json({
      success: true,
      message: 'Authenticated profile fetched successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          lastLoginAt: user.lastLoginAt,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateAccount(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const auth = (request as Request & { auth?: { sub?: string } }).auth
    if (!auth?.sub) {
      throw new AppError('Authenticated user context is missing', 401)
    }

    const parsedBody = accountUpdateSchema.safeParse(request.body)
    if (!parsedBody.success) {
      throw new AppError('Invalid account update payload', 400, parsedBody.error.flatten())
    }

    const user = await prisma.adminUser.findUnique({ where: { id: auth.sub } })
    if (!user || !user.isActive) {
      throw new AppError('Authenticated user was not found', 404)
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      parsedBody.data.currentPassword,
      user.passwordHash,
    )
    if (!isCurrentPasswordValid) {
      throw new AppError('Your current password is incorrect', 401)
    }

    const email = parsedBody.data.email.toLowerCase()
    const existingEmailOwner = await prisma.adminUser.findUnique({ where: { email } })
    if (existingEmailOwner && existingEmailOwner.id !== user.id) {
      throw new AppError('That email address is already in use', 409)
    }

    const passwordHash = parsedBody.data.newPassword
      ? await bcrypt.hash(parsedBody.data.newPassword, 12)
      : user.passwordHash
    const credentialsChanged =
      email !== user.email || Boolean(parsedBody.data.newPassword)

    const updatedUser = await prisma.$transaction(async (transaction) => {
      const account = await transaction.adminUser.update({
        where: { id: user.id },
        data: {
          firstName: parsedBody.data.firstName,
          lastName: parsedBody.data.lastName,
          email,
          passwordHash,
        },
      })

      if (credentialsChanged) {
        await transaction.refreshToken.updateMany({
          where: { userId: user.id, revokedAt: null },
          data: { revokedAt: new Date() },
        })
      }

      return account
    })

    if (credentialsChanged) {
      response.clearCookie(ACCESS_COOKIE_NAME, { path: '/' })
      response.clearCookie(REFRESH_COOKIE_NAME, { path: '/' })
    }

    response.status(200).json({
      success: true,
      message: credentialsChanged
        ? 'Account updated. Please sign in again with the new details.'
        : 'Account details updated successfully.',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
        },
        signedOut: credentialsChanged,
      },
    })
  } catch (error) {
    next(error)
  }
}
