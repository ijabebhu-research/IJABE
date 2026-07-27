import { BookOpenText, CalendarDays, FileText, Mail, Newspaper, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAdmin } from '@/components/admin/use-admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function AdminDashboardPage() {
  const { dashboard, snapshot } = useAdmin()

  const dashboardStats = [
    {
      label: 'News items',
      value: String(dashboard?.news ?? snapshot.news.length),
      icon: Newspaper,
    },
    {
      label: 'Publications',
      value: String(dashboard?.publications ?? snapshot.publications.length),
      icon: FileText,
    },
    {
      label: 'Conferences',
      value: String(dashboard?.events ?? snapshot.events.length),
      icon: CalendarDays,
    },
  ]

  const adminModules = [
    {
      title: 'Journal issues',
      icon: BookOpenText,
      description: 'Set each journal edition’s volume, issue number, date, and description.',
      href: '/admin/issues',
    },
    {
      title: 'Articles',
      icon: FileText,
      description: 'Upload articles and assign each one to its journal issue.',
      href: '/admin/publications',
    },
    {
      title: 'News',
      icon: Newspaper,
      description: 'Post the latest updates from IJABE and Bingham University.',
      href: '/admin/news',
    },
    {
      title: 'Conferences',
      icon: Users,
      description: 'Publish conferences and keep applications accessible.',
      href: '/admin/events',
    },
    {
      title: 'Applicants',
      icon: Users,
      description: 'Review conference applications and reply by email.',
      href: '/admin/applicants',
    },
    {
      title: 'Enquiries',
      icon: Mail,
      description: 'Read and respond to messages sent from the public contact page.',
      href: '/admin/enquiries',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat.label} className="border-[#154734]/15 bg-white text-slate-950 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                  <Icon className="size-5" />
                </div>
                <CardDescription className="text-slate-700">{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-[#154734]/15 bg-white text-slate-950 shadow-sm">
        <CardHeader>
          <Badge className="w-fit bg-[#e7f0e8] text-[#154734]">Ready to manage</Badge>
          <CardTitle className="font-sans text-3xl">
            Simple IJABE content management.
          </CardTitle>
          <CardDescription className="text-slate-700">
            Manage only the content that matters: publications, news, conferences, applicants, and site details.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {adminModules.map((module) => {
            const Icon = module.icon

            return (
              <div
                key={module.title}
                className="rounded-3xl border border-[#154734]/15 bg-[#f7f5ef] p-5"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[#e7f0e8] text-[#154734]">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-xl font-semibold">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {module.description}
                </p>
                <Button asChild className="mt-4" variant="secondary">
                  <NavLink to={module.href}>Open module</NavLink>
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

    </div>
  )
}
