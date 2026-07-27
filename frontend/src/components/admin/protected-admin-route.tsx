import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAdmin } from '@/components/admin/use-admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProtectedAdminRoute({ children }: { children: ReactElement }) {
  const location = useLocation()
  const { isAuthLoading, user } = useAdmin()

  if (isAuthLoading) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-2xl items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Checking administrator session</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Validating the authenticated admin workspace before loading the CMS.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/admin/login" />
  }

  return children
}
