import { CalendarDays } from 'lucide-react'
import { useState } from 'react'

import { DataStatus } from '@/components/public/data-status'
import { PageIntro } from '@/components/public/page-intro'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublicSiteContent, submitConferenceApplication } from '@/lib/api/public-api'
import { fallbackSiteContent } from '@/lib/public-content'

export function EventsPage() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setIsSubmitting(true)
    setMessage(null)
    try {
      const result = await submitConferenceApplication({
        fullName: String(form.get('fullName') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? ''),
        institution: String(form.get('institution') ?? ''),
        eventTitle: String(form.get('eventTitle') ?? ''),
        message: String(form.get('message') ?? ''),
      })
      setMessage(`Application received. Your reference is ${result.reference}.`)
      formElement.reset()
    } catch {
      setMessage('We could not submit your application. Please try again.')
    } finally { setIsSubmitting(false) }
  }

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={siteContentState.isFallback}
        isLoading={siteContentState.isLoading}
      />

      <PageIntro
        description="Conference announcements from IJABE and Bingham University. Apply online when an open conference is listed."
        eyebrow="IJABE & Bingham University"
        title="Conferences"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {siteContentState.data.events.map((event) => (
          <Card key={event.slug}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CalendarDays className="size-5" />
                </div>
                <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'}>
                  {event.status}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{event.summary}</p>
              <p>Venue: {event.venue}</p>
              <p>{new Date(event.startsAt).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card id="apply">
        <CardHeader><Badge className="w-fit">Conference application</Badge><CardTitle className="text-2xl">Apply for an open conference</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submitApplication}>
            <Input name="fullName" placeholder="Full name" required />
            <Input name="email" placeholder="Email address" type="email" required />
            <Input name="phone" placeholder="Phone number (optional)" />
            <Input name="institution" placeholder="Institution" required />
            <Input className="md:col-span-2" name="eventTitle" placeholder="Conference title" required />
            <textarea className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm md:col-span-2" name="message" placeholder="Brief note or question (optional)" />
            <div className="md:col-span-2"><Button disabled={isSubmitting} type="submit">{isSubmitting ? 'Submitting…' : 'Submit application'}</Button>{message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}</div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
