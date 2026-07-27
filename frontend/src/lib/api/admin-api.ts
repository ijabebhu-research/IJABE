import type {
  BrandingContent,
  ContactProfile,
  DownloadItem,
  EditorialBoardMember,
  EventItem,
  GalleryItem,
  HomepageContent,
  LeadershipContent,
  NewsItem,
  Publication,
  StaticPage,
  Issue,
} from '@/lib/public-content'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

export type AdminUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN'
  lastLoginAt?: string | null
}

export type AdminContentSnapshot = {
  homepage: HomepageContent
  pages: StaticPage[]
  publications: Publication[]
  issues: Issue[]
  news: NewsItem[]
  events: EventItem[]
  gallery: GalleryItem[]
  downloads: DownloadItem[]
  contact: ContactProfile
  branding: BrandingContent
  leadership: LeadershipContent
  editorialBoardMembers: EditorialBoardMember[]
}

export type AdminDashboardSummary = {
  contentAreas: number
  pages: number
  issues: number
  publications: number
  news: number
  events: number
  gallery: number
  downloads: number
  editorialBoardMembers: number
  currentIssueTitle: string
}

export type ConferenceApplicant = { id: string; fullName: string; email: string; phone?: string | null; institution: string; eventTitle: string; message?: string | null; status: 'NEW' | 'REVIEWED' | 'RESPONDED'; createdAt: string }
export type ContactInquiry = { id: string; name: string; email: string; subject: string; message: string; createdAt: string }

type LoginPayload = {
  email: string
  password: string
}

export type AccountUpdatePayload = {
  firstName: string
  lastName: string
  email: string
  currentPassword: string
  newPassword?: string
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api'

async function renewAdminSession() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  return response.ok
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (response.status === 401 && !path.startsWith('/auth/')) {
    const renewed = await renewAdminSession()
    if (renewed) {
      response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers ?? {}),
        },
        ...init,
      })
    }
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null
    throw new Error(payload?.message ?? `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const payload = (await response.json()) as ApiEnvelope<T>
  return payload.data
}

export function loginAdmin(payload: LoginPayload) {
  return request<{ user: AdminUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logoutAdmin() {
  return request<void>('/auth/logout', {
    method: 'POST',
  })
}

export function getCurrentAdminUser() {
  return request<{ user: AdminUser }>('/auth/me')
}

export function updateAdminAccount(payload: AccountUpdatePayload) {
  return request<{ user: AdminUser; signedOut: boolean }>('/auth/account', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function getAdminDashboard() {
  return request<{ user?: AdminUser; summary: AdminDashboardSummary }>(
    '/admin/dashboard',
  )
}

export function getAdminContent() {
  return request<AdminContentSnapshot>('/admin/content')
}

export function updateAdminContent(snapshot: AdminContentSnapshot) {
  return request<AdminContentSnapshot>('/admin/content', {
    method: 'PUT',
    body: JSON.stringify(snapshot),
  })
}

export async function uploadPublicationFile(file: File) {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.readAsDataURL(file)
  })
  return request<{ fileUrl: string }>('/uploads/publication', { method: 'POST', body: JSON.stringify({ fileName: file.name, mimeType: file.type, base64 }) })
}

export async function uploadImageFile(file: File) {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(new Error('Could not read the selected image.'))
    reader.readAsDataURL(file)
  })
  return request<{ fileUrl: string }>('/uploads/image', { method: 'POST', body: JSON.stringify({ fileName: file.name, mimeType: file.type, base64 }) })
}

export function getApplicants() { return request<ConferenceApplicant[]>('/admin/applicants') }
export function updateApplicantStatus(id: string, status: ConferenceApplicant['status']) { return request<ConferenceApplicant>(`/admin/applicants/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }) }
export function deleteApplicant(id: string) { return request<void>(`/admin/applicants/${id}`, { method: 'DELETE' }) }
export function getEnquiries() { return request<ContactInquiry[]>('/admin/enquiries') }
export function deleteEnquiry(id: string) { return request<void>(`/admin/enquiries/${id}`, { method: 'DELETE' }) }
