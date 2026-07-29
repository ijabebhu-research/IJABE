import { LoaderCircle, Mail, MapPin, Phone } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { DataStatus } from '@/components/public/data-status'
import { PageIntro } from '@/components/public/page-intro'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { usePublicResource } from '@/hooks/use-public-resource'
import { getPublicSiteContent, submitContactInquiry } from '@/lib/api/public-api'
import { fallbackSiteContent } from '@/lib/public-content'

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export function ContactPage() {
  const siteContentState = usePublicResource(getPublicSiteContent, fallbackSiteContent)
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionReference, setSubmissionReference] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const contact = siteContentState.data.contact

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    setSubmissionReference(null)

    try {
      const response = await submitContactInquiry(form)
      setSubmissionReference(response.reference)
      setForm(initialForm)
    } catch {
      setErrorMessage(
        'We could not submit your enquiry right now. Please try again or use the contact emails listed on this page.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={siteContentState.isFallback}
        isLoading={siteContentState.isLoading}
      />

      <PageIntro
        description="Send an enquiry to the IJABE team, confirm the best contact channel, and reach the office without creating an account."
        eyebrow="Reach The Team"
        title="Contact IJABE"
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{contact.officeName}</CardTitle>
            <CardDescription>
              Public users can reach the editorial and research unit team through the channels below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
              <Mail className="mt-0.5 size-4 text-primary" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">Email</p>
                <a className="block hover:text-foreground" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
                <a
                  className="block hover:text-foreground"
                  href={`mailto:${contact.supportEmail}`}
                >
                  {contact.supportEmail}
                </a>
              </div>
            </div>

            {contact.editorialContacts?.filter((person) => person.name || person.phone).map((person) => (
              <div key={person.role} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
                <Phone className="mt-0.5 size-4 text-primary" />
                <div className="space-y-1"><p className="font-medium text-foreground">{person.role}</p><p>{person.name}</p>{person.phone && <a className="block hover:text-foreground" href={`tel:${person.phone}`}>{person.phone}</a>}</div>
              </div>
            ))}

            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
              <Phone className="mt-0.5 size-4 text-primary" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">Phone</p>
                <a className="block hover:text-foreground" href={`tel:${contact.phone}`}>
                  {contact.phone}
                </a>
                <p>{contact.officeHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
              <MapPin className="mt-0.5 size-4 text-primary" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">Office Address</p>
                <p>{contact.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Send an enquiry</CardTitle>
            <CardDescription>
              Use the public contact form for publication, journal, or research unit enquiries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  aria-label="Your name"
                  name="name"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Your full name"
                  required
                  value={form.name}
                />
                <Input
                  aria-label="Your email"
                  name="email"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>

              <Input
                aria-label="Subject"
                name="subject"
                onChange={(event) =>
                  setForm((current) => ({ ...current, subject: event.target.value }))
                }
                placeholder="Subject"
                required
                value={form.subject}
              />

              <textarea
                aria-label="Message"
                className="flex min-h-40 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                name="message"
                onChange={(event) =>
                  setForm((current) => ({ ...current, message: event.target.value }))
                }
                placeholder="Tell the IJABE team how they can help."
                required
                value={form.message}
              />

              <Button className="w-full sm:w-auto" disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Sending enquiry
                  </>
                ) : (
                  'Submit enquiry'
                )}
              </Button>
            </form>

            {submissionReference ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                Enquiry submitted successfully. Reference: {submissionReference}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
