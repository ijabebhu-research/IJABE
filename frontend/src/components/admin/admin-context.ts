import { createContext } from 'react'

import type {
  AdminContentSnapshot,
  AdminDashboardSummary,
  AdminUser,
} from '@/lib/api/admin-api'

export type AdminContextValue = {
  user: AdminUser | null
  dashboard: AdminDashboardSummary | null
  snapshot: AdminContentSnapshot
  isAuthLoading: boolean
  isContentLoading: boolean
  isSaving: boolean
  loginError: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateAccount: (payload: import('@/lib/api/admin-api').AccountUpdatePayload) => Promise<{ signedOut: boolean }>
  refreshAdminState: () => Promise<void>
  saveSnapshot: (snapshot: AdminContentSnapshot) => Promise<void>
}

export const AdminContext = createContext<AdminContextValue | null>(null)
