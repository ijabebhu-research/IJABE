import { Outlet } from 'react-router-dom'

import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'

export function PublicLayout() {
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
