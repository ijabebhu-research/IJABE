import { ChevronRight, LayoutDashboard } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAdmin } from '@/components/admin/use-admin'
import { Button } from '@/components/ui/button'
import { adminNavItems } from '@/lib/navigation'

export function AdminLayout() {
  const { dashboard, logout, user } = useAdmin()

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-[28px] border border-[#154734]/15 bg-white p-5 shadow-sm">
          <div className="mb-8 space-y-2">
            <img alt="Bingham University logo" className="h-16 w-16 rounded-xl object-cover" src="/images/bingham-university-logo.jpg" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#154734]">Admin workspace</p>
            <h1 className="flex items-center gap-2 text-2xl font-semibold">
              <LayoutDashboard className="size-5" />
              IJABE Admin
            </h1>
            <p className="text-sm leading-6 text-slate-600">Manage IJABE publications, news, conferences, and applications.</p>
          </div>

          <nav className="space-y-2">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                className={({ isActive }) =>
                  `block rounded-2xl border px-4 py-3 text-sm transition ${
                    isActive
                      ? 'border-[#154734]/30 bg-[#e7f0e8] text-slate-950'
                      : 'border-[#154734]/10 bg-white text-slate-700 hover:border-[#154734]/25 hover:bg-[#f4f0e4]'
                  }`
                }
                to={item.path}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{item.label}</span>
                  <ChevronRight className="size-4 text-slate-500" />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <header className="flex flex-col gap-3 rounded-[28px] border border-[#154734]/15 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#154734]">
                Authenticated Workspace
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Welcome back, {user?.firstName ?? 'Administrator'}.
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Current issue: {dashboard?.currentIssueTitle ?? 'Not set'}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <NavLink to="/">Return to website</NavLink>
              </Button>
              <Button
                onClick={() => void logout()}
                type="button"
                variant="ghost"
              >
                Sign out
              </Button>
            </div>
          </header>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
