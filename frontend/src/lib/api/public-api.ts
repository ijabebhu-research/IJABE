import {
  fallbackArchiveIssues,
  fallbackCurrentIssue,
  fallbackPublications,
  fallbackSiteContent,
  type ArchiveIssue,
  type ContactInquiryPayload,
  type ContactInquiryResponse,
  type CurrentIssue,
  type Publication,
  type PublicSiteContent,
} from '@/lib/public-content'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api'

async function request<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`)

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const payload = (await response.json()) as ApiEnvelope<T>
    return payload.data
  } catch {
    return fallback
  }
}

async function post<TRequest, TResponse>(
  path: string,
  body: TRequest,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as ApiEnvelope<TResponse>
  return payload.data
}

export function getPublicSiteContent() {
  return request<PublicSiteContent>('/site-settings/public', fallbackSiteContent)
}

export function getCurrentIssue() {
  return request<CurrentIssue>('/issues/current', fallbackCurrentIssue)
}

export function getIssueBySlug(slug: string) {
  const fallbackIssue =
    slug === fallbackCurrentIssue.slug
      ? fallbackCurrentIssue
      : {
          ...fallbackCurrentIssue,
          ...fallbackArchiveIssues.find((issue) => issue.slug === slug),
          publications: fallbackPublications.filter((publication) => publication.issueSlug === slug),
        }

  return request<CurrentIssue>(`/issues/${slug}`, fallbackIssue)
}

export function getArchiveIssues() {
  return request<ArchiveIssue[]>('/issues/archives', fallbackArchiveIssues)
}

export function getPublications(query?: string, issue?: string) {
  const params = new URLSearchParams()

  if (query) {
    params.set('q', query)
  }

  if (issue) {
    params.set('issue', issue)
  }

  const suffix = params.toString() ? `?${params.toString()}` : ''
  return request<Publication[]>(`/publications${suffix}`, fallbackPublications)
}

export async function getPublicationBySlug(slug: string) {
  const fallbackPublication =
    fallbackPublications.find((publication) => publication.slug === slug) ??
    fallbackPublications[0]

  return request<Publication>(`/publications/${slug}`, fallbackPublication)
}

export function submitContactInquiry(payload: ContactInquiryPayload) {
  return post<ContactInquiryPayload, ContactInquiryResponse>(
    '/site-settings/contact',
    payload,
  )
}

export type ConferenceApplicationPayload = {
  fullName: string
  email: string
  phone?: string
  institution: string
  eventTitle: string
  message?: string
}

export function submitConferenceApplication(payload: ConferenceApplicationPayload) {
  return post<ConferenceApplicationPayload, { id: string; reference: string }>(
    '/site-settings/conference-applications',
    payload,
  )
}
