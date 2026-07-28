import { Outlet } from 'react-router-dom'

import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublicSiteContent } from '@/lib/api/public-api'
import { fallbackSiteContent } from '@/lib/public-content'

export function PublicLayout() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)

  if (siteContentState.isLoading || siteContentState.isFallback) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="mx-auto h-14 w-14 animate-pulse rounded-2xl bg-primary/15" />
          <div className="mx-auto h-5 w-24 animate-pulse rounded bg-primary/15" />
          <div className="mx-auto h-4 w-56 animate-pulse rounded bg-muted" />
          <p className="text-sm text-muted-foreground">
            {siteContentState.isLoading ? 'Loading IJABE...' : 'Live content is temporarily unavailable. Please refresh the page.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-6 py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
