import { AlertCircle } from 'lucide-react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import { AdminProvider } from '@/components/admin/admin-provider'
import { ProtectedAdminRoute } from '@/components/admin/protected-admin-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminLayout } from '@/layouts/admin-layout'
import { PublicLayout } from '@/layouts/public-layout'
import { adminNavItems } from '@/lib/navigation'
import { AdminContentManagerPage } from '@/pages/admin/admin-content-manager-page'
import { AdminDashboardPage } from '@/pages/admin/admin-dashboard-page'
import { AdminLoginPage } from '@/pages/admin/admin-login-page'
import { AdminApplicantsPage } from '@/pages/admin/admin-applicants-page'
import { AdminEnquiriesPage } from '@/pages/admin/admin-enquiries-page'
import { AdminAccountPage } from '@/pages/admin/admin-account-page'
import { ArchivesPage } from '@/pages/public/archives-page'
import { ContactPage } from '@/pages/public/contact-page'
import { ContentPage } from '@/pages/public/content-page'
import { CurrentIssuePage } from '@/pages/public/current-issue-page'
import { IssueDetailPage } from '@/pages/public/issue-detail-page'
import { DownloadsPage } from '@/pages/public/downloads-page'
import { EventsPage } from '@/pages/public/events-page'
import { GalleryPage } from '@/pages/public/gallery-page'
import { HomePage } from '@/pages/public/home-page'
import { NewsPage } from '@/pages/public/news-page'
import { PublicationDetailPage } from '@/pages/public/publication-detail-page'
import { RepositoryPage } from '@/pages/public/repository-page'
import { SearchPage } from '@/pages/public/search-page'

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <CardTitle className="mt-4 text-3xl">Page not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            This address is not available or the URL is incorrect.
          </p>
          <Button asChild>
            <NavLink to="/">Return home</NavLink>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function AppRouter() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/about-ijabe" element={<ContentPage slug="about-ijabe" />} />
            <Route
              path="/about-research-unit"
              element={<ContentPage slug="about-research-unit" />}
            />
            <Route
              path="/editorial-board"
              element={<ContentPage slug="editorial-board" />}
            />
            <Route path="/current-issue" element={<CurrentIssuePage />} />
            <Route path="/issues/:slug" element={<IssueDetailPage />} />
            <Route path="/archives" element={<ArchivesPage />} />
            <Route path="/research-repository" element={<RepositoryPage />} />
            <Route
              path="/research-repository/:slug"
              element={<PublicationDetailPage />}
            />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route
              path="homepage"
              element={<AdminContentManagerPage moduleKey="homepage" />}
            />
            <Route
              path="journal-info"
              element={<AdminContentManagerPage moduleKey="journal-info" />}
            />
            <Route
              path="issues"
              element={<AdminContentManagerPage moduleKey="issues" />}
            />
            <Route
              path="archives"
              element={<AdminContentManagerPage moduleKey="archives" />}
            />
            <Route
              path="publications"
              element={<AdminContentManagerPage moduleKey="publications" />}
            />
            <Route
              path="editorial-board"
              element={<AdminContentManagerPage moduleKey="editorial-board" />}
            />
            <Route
              path="news"
              element={<AdminContentManagerPage moduleKey="news" />}
            />
            <Route
              path="events"
              element={<AdminContentManagerPage moduleKey="events" />}
            />
            <Route
              path="gallery"
              element={<AdminContentManagerPage moduleKey="gallery" />}
            />
            <Route
              path="downloads"
              element={<AdminContentManagerPage moduleKey="downloads" />}
            />
            <Route
              path="contacts"
              element={<AdminContentManagerPage moduleKey="contacts" />}
            />
            <Route
              path="branding"
              element={<AdminContentManagerPage moduleKey="branding" />}
            />
            <Route path="applicants" element={<AdminApplicantsPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="account" element={<AdminAccountPage />} />
          </Route>

          {adminNavItems.map(() => null)}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}
