import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  type AdminContentSnapshot,
  type AdminDashboardSummary,
  type AdminUser,
  getAdminContent,
  getAdminDashboard,
  getCurrentAdminUser,
  loginAdmin,
  logoutAdmin,
  updateAdminAccount,
  updateAdminContent,
} from '@/lib/api/admin-api'
import { AdminContext, type AdminContextValue } from '@/components/admin/admin-context'
import { fallbackSiteContent, fallbackPublications, fallbackCurrentIssue } from '@/lib/public-content'

const fallbackSnapshot: AdminContentSnapshot = {
  homepage: fallbackSiteContent.homepage,
  pages: fallbackSiteContent.pages,
  publications: fallbackPublications,
  issues: [
    {
      slug: fallbackCurrentIssue.slug,
      title: fallbackCurrentIssue.title,
      volume: fallbackCurrentIssue.volume,
      issueNumber: fallbackCurrentIssue.issueNumber,
      publicationDate: fallbackCurrentIssue.publicationDate,
      description: fallbackCurrentIssue.description,
      isCurrent: true,
    },
  ],
  news: fallbackSiteContent.news,
  events: fallbackSiteContent.events,
  gallery: fallbackSiteContent.gallery,
  downloads: fallbackSiteContent.downloads,
  contact: fallbackSiteContent.contact,
  branding: fallbackSiteContent.branding,
  leadership: fallbackSiteContent.leadership,
  editorialBoardMembers: fallbackSiteContent.editorialBoardMembers,
}

export function AdminProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [dashboard, setDashboard] = useState<AdminDashboardSummary | null>(null)
  const [snapshot, setSnapshot] = useState<AdminContentSnapshot>(fallbackSnapshot)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const loadContent = useCallback(async () => {
    setIsContentLoading(true)

    try {
      const [dashboardResponse, snapshotResponse] = await Promise.all([
        getAdminDashboard(),
        getAdminContent(),
      ])

      setDashboard(dashboardResponse.summary)
      setSnapshot(snapshotResponse)
    } finally {
      setIsContentLoading(false)
    }
  }, [])

  const refreshAdminState = useCallback(async () => {
    setIsAuthLoading(true)

    try {
      const response = await getCurrentAdminUser()
      setUser(response.user)
      await loadContent()
      setLoginError(null)
    } catch {
      setUser(null)
      setDashboard(null)
    } finally {
      setIsAuthLoading(false)
    }
  }, [loadContent])

  useEffect(() => {
    void refreshAdminState()
  }, [refreshAdminState])

  const login = useCallback(
    async (email: string, password: string) => {
      setLoginError(null)
      await loginAdmin({ email, password })
      await refreshAdminState()
    },
    [refreshAdminState],
  )

  const logout = useCallback(async () => {
    await logoutAdmin()
    setUser(null)
    setDashboard(null)
  }, [])

  useEffect(() => {
    if (!user) return

    let idleTimeout: number
    const resetIdleTimer = () => {
      window.clearTimeout(idleTimeout)
      idleTimeout = window.setTimeout(() => {
        void logout()
      }, 10 * 60 * 1000)
    }
    const activityEvents: Array<keyof WindowEventMap> = [
      'click',
      'keydown',
      'mousemove',
      'scroll',
      'touchstart',
    ]

    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, resetIdleTimer, { passive: true }),
    )
    resetIdleTimer()

    return () => {
      window.clearTimeout(idleTimeout)
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetIdleTimer))
    }
  }, [logout, user])

  const updateAccount = useCallback(async (
    payload: import('@/lib/api/admin-api').AccountUpdatePayload,
  ) => {
    const response = await updateAdminAccount(payload)
    setUser(response.user)
    if (response.signedOut) {
      setUser(null)
      setDashboard(null)
    }
    return { signedOut: response.signedOut }
  }, [])

  const saveSnapshot = useCallback(async (nextSnapshot: AdminContentSnapshot) => {
    setIsSaving(true)

    try {
      const updatedSnapshot = await updateAdminContent(nextSnapshot)
      setSnapshot(updatedSnapshot)

      const dashboardResponse = await getAdminDashboard()
      setDashboard(dashboardResponse.summary)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save admin content.'
      setLoginError(message)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [])

  const value = useMemo<AdminContextValue>(
    () => ({
      user,
      dashboard,
      snapshot,
      isAuthLoading,
      isContentLoading,
      isSaving,
      loginError,
      login,
      logout,
      updateAccount,
      refreshAdminState,
      saveSnapshot,
    }),
    [
      dashboard,
      isAuthLoading,
      isContentLoading,
      isSaving,
      login,
      loginError,
      logout,
      updateAccount,
      refreshAdminState,
      saveSnapshot,
      snapshot,
      user,
    ],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
