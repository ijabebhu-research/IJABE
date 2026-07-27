import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.url().default('http://localhost:5173'),
  FRONTEND_URLS: z.string().optional(),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  STORAGE_PROVIDER: z.enum(['local', 'r2']).default('local'),
  R2_ACCOUNT_ID: z.string().trim().min(1).optional(),
  R2_ACCESS_KEY_ID: z.string().trim().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().trim().min(1).optional(),
  R2_BUCKET: z.string().trim().min(1).optional(),
  R2_PUBLIC_BASE_URL: z.url().optional(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n')

  throw new Error(`Invalid environment configuration:\n${formattedErrors}`)
}

const baseEnv = parsedEnv.data
const r2Variables = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_BASE_URL'] as const

if (baseEnv.NODE_ENV === 'production' && baseEnv.STORAGE_PROVIDER !== 'r2') {
  throw new Error('Invalid environment configuration:\nSTORAGE_PROVIDER: Production deployments must use R2 storage.')
}

if (baseEnv.STORAGE_PROVIDER === 'r2') {
  const missingVariables = r2Variables.filter((variable) => !baseEnv[variable])
  if (missingVariables.length > 0) {
    throw new Error(`Invalid environment configuration:\n${missingVariables.join(', ')}: Required when STORAGE_PROVIDER is r2.`)
  }
}

export const env = {
  ...baseEnv,
  frontendUrls: [
    baseEnv.FRONTEND_URL,
    ...(baseEnv.FRONTEND_URLS?.split(',').map((url) => url.trim()).filter(Boolean) ?? []),
  ],
}
