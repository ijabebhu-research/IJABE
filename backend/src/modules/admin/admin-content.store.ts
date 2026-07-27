import { prisma } from '../../config/prisma.js'

type Metric = {
  label: string
  value: string
}

type StaticPageSection = {
  title: string
  body: string
  bulletPoints?: string[]
}

type StaticPage = {
  slug: string
  title: string
  eyebrow: string
  summary: string
  sections: StaticPageSection[]
}

type Issue = {
  slug: string
  title: string
  volume: number
  issueNumber: number
  publicationDate: string
  description: string
  isCurrent: boolean
}

type Publication = {
  slug: string
  title: string
  abstract: string
  authors: string[]
  keywords: string[]
  publishedAt: string
  issueSlug: string
  issueTitle?: string
  pdfUrl: string
  doi: string
  category: string
}

type NewsItem = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
}

type EventItem = {
  slug: string
  title: string
  summary: string
  venue: string
  startsAt: string
  status: 'Upcoming' | 'Completed'
}

type GalleryItem = {
  id: string
  title: string
  category: string
  imageUrl: string
}

type DownloadItem = {
  id: string
  title: string
  description: string
  category: string
  fileUrl: string
  fileSize: string
}

type ContactProfile = {
  officeName: string
  email: string
  supportEmail: string
  phone: string
  address: string
  officeHours: string
}

type BrandingContent = {
  universityLogoUrl: string
  journalLogoUrl: string
  heroBannerUrl: string
  issn: string
}

type LeadershipProfile = {
  id: string
  name: string
  title: string
  summary: string
  imageUrl: string
}

type LeadershipContent = {
  viceChancellor: LeadershipProfile
  universityManagement: LeadershipProfile
  researchUnitHead: LeadershipProfile
}

type EditorialBoardMember = {
  id: string
  name: string
  role: string
  affiliation: string
  summary: string
  imageUrl: string
}

type HomepageContent = {
  heroTitle: string
  heroSummary: string
  metrics: Metric[]
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

// Default fallback content
const defaultHomepage: HomepageContent = {
  heroTitle: 'Advancing Knowledge in Accounting, Business & Entrepreneurship',
  heroSummary:
    'A peer-reviewed international journal dedicated to excellence in research and practice across accounting, business administration, and entrepreneurship.',
  metrics: [
    { label: 'Issues archived', value: '1' },
    { label: 'Featured publications', value: '2' },
    { label: 'Editorial updates', value: '1' },
  ],
}

const defaultContact: ContactProfile = {
  officeName: 'IJABE Research Unit',
  email: 'research.unit@ijabe.edu',
  supportEmail: 'editorial.office@ijabe.edu',
  phone: '+234 800 000 0000',
  address: 'Research Unit Building, Main Campus, Bauchi, Nigeria',
  officeHours: 'Monday to Friday, 8:00 AM to 4:00 PM',
}

const defaultBranding: BrandingContent = {
  universityLogoUrl: '/images/bingham-university-logo.jpg',
  journalLogoUrl: '/images/bingham-university-logo.jpg',
  heroBannerUrl: '/images/bingham-university-logo.jpg',
  issn: '',
}

const defaultLeadership: LeadershipContent = {
  viceChancellor: {
    id: 'leadership-vice-chancellor',
    name: 'Prof. Haruna K. Ayuba',
    title: 'Vice Chancellor, Bingham University, Karu',
    summary:
      'Provides executive leadership for institutional quality, research visibility, and academic partnerships that strengthen the journal ecosystem.',
    imageUrl: '/images/prof-haruna-k-ayuba.jpg',
  },
  universityManagement: {
    id: 'leadership-university-management',
    name: 'Prof. Orbunde B. Bemshima',
    title: 'Dean, Faculty of Administration and Management Sciences',
    summary:
      'Supports institutional governance, research administration, and operational systems that sustain publication quality and public access.',
    imageUrl: '/images/prof-orbunde-b-bemshima.jpg',
  },
  researchUnitHead: {
    id: 'leadership-research-unit-head',
    name: 'Dr Caleb Y. Yashim',
    title: 'Chairman, Faculty Research Committee',
    summary:
      'Leads the research unit strategy for scholarly communication, publication quality, and knowledge dissemination through IJABE.',
    imageUrl: '/images/dr-caleb-y-yashim.jpg',
  },
}

async function getStoredSetting<T>(key: string, fallback: T): Promise<T> {
  const setting = await prisma.siteSetting.findUnique({ where: { key } })
  if (!setting) return fallback
  try { return JSON.parse(setting.value) as T } catch { return fallback }
}

async function getHomepageContent(): Promise<HomepageContent> {
  const heroTitle = await prisma.siteSetting.findUnique({
    where: { key: 'homepage_hero_title' },
  })
  const heroSummary = await prisma.siteSetting.findUnique({
    where: { key: 'homepage_hero_summary' },
  })

  return {
    heroTitle: heroTitle?.value ?? defaultHomepage.heroTitle,
    heroSummary: heroSummary?.value ?? defaultHomepage.heroSummary,
    metrics: defaultHomepage.metrics,
  }
}

async function getStaticPages(): Promise<StaticPage[]> {
  const pages = await prisma.staticPage.findMany({
    where: { status: 'PUBLISHED' },
  })

  return pages.map((page: { slug: string; title: string; excerpt?: string | null; content?: string | null }) => ({
    slug: page.slug,
    title: page.title,
    eyebrow: 'Journal Information',
    summary: page.excerpt ?? '',
    sections: [
      {
        title: 'Overview',
        body: page.content ?? '',
      },
    ],
  }))
}

async function getIssues(): Promise<Issue[]> {
  const issues = await prisma.issue.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publicationDate: 'desc' },
  })

  return issues.map((issue: { slug: string; title: string; volume?: number | null; issueNumber?: number | null; publicationDate?: Date | null; description?: string | null; isCurrent: boolean }) => ({
    slug: issue.slug,
    title: issue.title,
    volume: issue.volume ?? 0,
    issueNumber: issue.issueNumber ?? 0,
    publicationDate: issue.publicationDate?.toISOString().split('T')[0] ?? '',
    description: issue.description ?? '',
    isCurrent: issue.isCurrent,
  }))
}

async function getPublications(): Promise<Publication[]> {
  const publications = await prisma.publication.findMany({
    where: { status: 'PUBLISHED' },
    include: { issue: true },
    orderBy: { publishedAt: 'desc' },
  })

  return publications.map((pub: { slug: string; title: string; abstract?: string | null; authors: string; keywords: string; publishedAt?: Date | null; pdfUrl?: string | null; doi?: string | null; issue?: { slug: string; title: string } | null }) => ({
    slug: pub.slug,
    title: pub.title,
    abstract: pub.abstract ?? '',
    authors: pub.authors.split(',').map((a: string) => a.trim()),
    keywords: pub.keywords.split(',').map((k: string) => k.trim()),
    publishedAt: pub.publishedAt?.toISOString().split('T')[0] ?? '',
    issueSlug: pub.issue?.slug ?? '',
    issueTitle: pub.issue?.title ?? '',
    pdfUrl: pub.pdfUrl ?? '',
    doi: pub.doi ?? '',
    category: 'Research',
  }))
}

async function getNews(): Promise<NewsItem[]> {
  const news = await prisma.newsPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
  })

  return news.map((item: { slug: string; title: string; excerpt?: string | null; publishedAt?: Date | null }) => ({
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt ?? '',
    category: 'Announcement',
    publishedAt: item.publishedAt?.toISOString().split('T')[0] ?? '',
  }))
}

async function getEvents(): Promise<EventItem[]> {
  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { startsAt: 'desc' },
  })

  return events.map((event: { slug: string; title: string; summary?: string | null; venue?: string | null; startsAt?: Date | null; status: string }) => ({
    slug: event.slug,
    title: event.title,
    summary: event.summary ?? '',
    venue: event.venue ?? '',
    startsAt: event.startsAt?.toISOString() ?? '',
    status: (event.status === 'PUBLISHED' ? 'Upcoming' : 'Completed') as 'Upcoming' | 'Completed',
  }))
}

async function getGallery(): Promise<GalleryItem[]> {
  const gallery = await prisma.galleryItem.findMany({
    where: { status: 'PUBLISHED' },
  })

  return gallery.map((item: { id: string; title: string; imageUrl: string }) => ({
    id: item.id,
    title: item.title,
    category: 'Gallery',
    imageUrl: item.imageUrl,
  }))
}

async function getDownloads(): Promise<DownloadItem[]> {
  const downloads = await prisma.download.findMany({
    where: { status: 'PUBLISHED' },
  })

  return downloads.map((item: { id: string; title: string; description?: string | null; fileUrl: string }) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    category: 'Resource',
    fileUrl: item.fileUrl,
    fileSize: '100 KB',
  }))
}

async function getEditorialBoardMembers(): Promise<EditorialBoardMember[]> {
  // For now, return default members as editorial board is not in the schema
  return [
    {
      id: 'board-1',
      name: 'Prof. Grace O. Nwafor',
      role: 'Editor-in-Chief',
      affiliation: 'Department of Accounting, IJABE Research Unit',
      summary:
        'Leads editorial direction, publication quality assurance, and strategic positioning for the journal.',
      imageUrl:
        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20female%20editor-in-chief%20portrait%2C%20academic%20journal%20leader%2C%20formal%20studio%20lighting%2C%20clean%20background&image_size=portrait_4_3',
    },
    {
      id: 'board-2',
      name: 'Dr. Peter M. Danjuma',
      role: 'Managing Editor',
      affiliation: 'School of Business Administration',
      summary:
        'Coordinates editorial operations, issue planning, and publication workflows for timely journal delivery.',
      imageUrl:
        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20male%20managing%20editor%20portrait%2C%20journal%20administrator%2C%20university%20editorial%20office%20style&image_size=portrait_4_3',
    },
  ]
}

export async function getAdminContentSnapshot(): Promise<AdminContentSnapshot> {
  const [homepage, pages, issues, publications, news, events, gallery, downloads, editorialBoardMembers, contact, branding, leadership] =
    await Promise.all([
      getHomepageContent(),
      getStaticPages(),
      getIssues(),
      getPublications(),
      getNews(),
      getEvents(),
      getGallery(),
      getDownloads(),
      getEditorialBoardMembers(),
      getStoredSetting('contact_profile', defaultContact),
      getStoredSetting('branding_profile', defaultBranding),
      getStoredSetting('leadership_profiles', defaultLeadership),
    ])

  return {
    homepage,
    pages,
    publications,
    issues,
    news,
    events,
    gallery,
    downloads,
    contact,
    branding: { ...defaultBranding, ...branding },
    leadership,
    editorialBoardMembers,
  }
}

export async function updateAdminContentSnapshot(
  nextSnapshot: AdminContentSnapshot,
): Promise<AdminContentSnapshot> {
  // Update homepage settings
  await prisma.siteSetting.upsert({
    where: { key: 'homepage_hero_title' },
    update: { value: nextSnapshot.homepage.heroTitle },
    create: { key: 'homepage_hero_title', value: nextSnapshot.homepage.heroTitle },
  })

  await prisma.siteSetting.upsert({
    where: { key: 'homepage_hero_summary' },
    update: { value: nextSnapshot.homepage.heroSummary },
    create: { key: 'homepage_hero_summary', value: nextSnapshot.homepage.heroSummary },
  })

  for (const [key, value] of [
    ['contact_profile', nextSnapshot.contact],
    ['branding_profile', nextSnapshot.branding],
    ['leadership_profiles', nextSnapshot.leadership],
  ] as const) {
    await prisma.siteSetting.upsert({
      where: { key }, update: { value: JSON.stringify(value) }, create: { key, value: JSON.stringify(value) },
    })
  }

  // Update issues
  for (const issue of nextSnapshot.issues) {
    await prisma.issue.upsert({
      where: { slug: issue.slug },
      update: {
        title: issue.title,
        volume: issue.volume,
        issueNumber: issue.issueNumber,
        publicationDate: new Date(issue.publicationDate),
        description: issue.description,
        isCurrent: issue.isCurrent,
        status: 'PUBLISHED',
      },
      create: {
        slug: issue.slug,
        title: issue.title,
        volume: issue.volume,
        issueNumber: issue.issueNumber,
        publicationDate: new Date(issue.publicationDate),
        description: issue.description,
        isCurrent: issue.isCurrent,
        status: 'PUBLISHED',
      },
    })
  }

  // Update publications
  for (const publication of nextSnapshot.publications) {
    const issue = await prisma.issue.findUnique({
      where: { slug: publication.issueSlug },
    })

    await prisma.publication.upsert({
      where: { slug: publication.slug },
      update: {
        title: publication.title,
        abstract: publication.abstract,
        authors: publication.authors.join(', '),
        keywords: publication.keywords.join(', '),
        publishedAt: new Date(publication.publishedAt),
        pdfUrl: publication.pdfUrl,
        doi: publication.doi,
        status: 'PUBLISHED',
        issueId: issue?.id,
      },
      create: {
        slug: publication.slug,
        title: publication.title,
        abstract: publication.abstract,
        authors: publication.authors.join(', '),
        keywords: publication.keywords.join(', '),
        publishedAt: new Date(publication.publishedAt),
        pdfUrl: publication.pdfUrl,
        doi: publication.doi,
        status: 'PUBLISHED',
        issueId: issue?.id,
      },
    })
  }

  // Update news
  for (const item of nextSnapshot.news) {
    await prisma.newsPost.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        publishedAt: new Date(item.publishedAt),
        status: 'PUBLISHED',
      },
      create: {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        publishedAt: new Date(item.publishedAt),
        status: 'PUBLISHED',
      },
    })
  }

  // Update events
  for (const item of nextSnapshot.events) {
    await prisma.event.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        summary: item.summary,
        venue: item.venue,
        startsAt: new Date(item.startsAt),
        status: 'PUBLISHED',
      },
      create: {
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        venue: item.venue,
        startsAt: new Date(item.startsAt),
        status: 'PUBLISHED',
      },
    })
  }

  // Update gallery
  for (const item of nextSnapshot.gallery) {
    await prisma.galleryItem.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        imageUrl: item.imageUrl,
        status: 'PUBLISHED',
      },
      create: {
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        status: 'PUBLISHED',
      },
    })
  }

  // Update downloads
  for (const item of nextSnapshot.downloads) {
    await prisma.download.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        fileUrl: item.fileUrl,
        status: 'PUBLISHED',
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        fileUrl: item.fileUrl,
        status: 'PUBLISHED',
      },
    })
  }

  // Update static pages
  for (const page of nextSnapshot.pages) {
    await prisma.staticPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        excerpt: page.summary,
        content: page.sections[0]?.body ?? '',
        status: 'PUBLISHED',
      },
      create: {
        slug: page.slug,
        title: page.title,
        excerpt: page.summary,
        content: page.sections[0]?.body ?? '',
        status: 'PUBLISHED',
      },
    })
  }

  await prisma.publication.deleteMany({
    where: { slug: { notIn: nextSnapshot.publications.map((publication) => publication.slug) } },
  })
  await prisma.newsPost.deleteMany({
    where: { slug: { notIn: nextSnapshot.news.map((item) => item.slug) } },
  })
  await prisma.event.deleteMany({
    where: { slug: { notIn: nextSnapshot.events.map((item) => item.slug) } },
  })
  await prisma.issue.deleteMany({
    where: { slug: { notIn: nextSnapshot.issues.map((issue) => issue.slug) } },
  })

  return getAdminContentSnapshot()
}

export async function getPublicSiteContent() {
  const snapshot = await getAdminContentSnapshot()

  return {
    homepage: snapshot.homepage,
    pages: snapshot.pages,
    news: snapshot.news,
    events: snapshot.events,
    gallery: snapshot.gallery,
    downloads: snapshot.downloads,
    contact: snapshot.contact,
    branding: snapshot.branding,
    leadership: snapshot.leadership,
    editorialBoardMembers: snapshot.editorialBoardMembers,
  }
}

export async function getCurrentIssueWithPublications() {
  const currentIssue = await prisma.issue.findFirst({
    where: { isCurrent: true, status: 'PUBLISHED' },
    include: { publications: { where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' } } },
  })

  if (!currentIssue) {
    return null
  }

  const publications = currentIssue.publications.map((pub: { slug: string; title: string; abstract?: string | null; authors: string; keywords: string; publishedAt?: Date | null; pdfUrl?: string | null; doi?: string | null }) => ({
    slug: pub.slug,
    title: pub.title,
    abstract: pub.abstract ?? '',
    authors: pub.authors.split(',').map((a: string) => a.trim()),
    keywords: pub.keywords.split(',').map((k: string) => k.trim()),
    publishedAt: pub.publishedAt?.toISOString().split('T')[0] ?? '',
    issueSlug: currentIssue.slug,
    issueTitle: currentIssue.title,
    pdfUrl: pub.pdfUrl ?? '',
    doi: pub.doi ?? '',
    category: 'Research',
  }))

  return {
    slug: currentIssue.slug,
    title: currentIssue.title,
    volume: currentIssue.volume ?? 0,
    issueNumber: currentIssue.issueNumber ?? 0,
    publicationDate: currentIssue.publicationDate?.toISOString().split('T')[0] ?? '',
    description: currentIssue.description ?? '',
    isCurrent: currentIssue.isCurrent,
    publications,
  }
}

export async function getIssueBySlugWithPublications(slug: string) {
  const issue = await prisma.issue.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { publications: { where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' } } },
  })

  if (!issue) {
    return null
  }

  return {
    slug: issue.slug,
    title: issue.title,
    volume: issue.volume ?? 0,
    issueNumber: issue.issueNumber ?? 0,
    publicationDate: issue.publicationDate?.toISOString().split('T')[0] ?? '',
    description: issue.description ?? '',
    isCurrent: issue.isCurrent,
    publications: issue.publications.map((publication) => ({
      slug: publication.slug,
      title: publication.title,
      abstract: publication.abstract ?? '',
      authors: publication.authors.split(',').map((author) => author.trim()),
      keywords: publication.keywords.split(',').map((keyword) => keyword.trim()),
      publishedAt: publication.publishedAt?.toISOString().split('T')[0] ?? '',
      issueSlug: issue.slug,
      issueTitle: issue.title,
      pdfUrl: publication.pdfUrl ?? '',
      doi: publication.doi ?? '',
      category: 'Research',
    })),
  }
}

export async function getArchiveIssuesWithCounts() {
  const issues = await prisma.issue.findMany({
    where: { isCurrent: false, status: 'PUBLISHED' },
    include: { publications: true },
  })

  return issues.map((issue: { slug: string; title: string; volume?: number | null; issueNumber?: number | null; publicationDate?: Date | null; description?: string | null; isCurrent: boolean; publications: unknown[] }) => ({
    slug: issue.slug,
    title: issue.title,
    volume: issue.volume ?? 0,
    issueNumber: issue.issueNumber ?? 0,
    publicationDate: issue.publicationDate?.toISOString().split('T')[0] ?? '',
    description: issue.description ?? '',
    isCurrent: issue.isCurrent,
    publicationCount: issue.publications.length,
  }))
}

export async function filterPublications(query?: string, issue?: string) {
  const searchQuery = query?.trim().toLowerCase() ?? ''
  const issueSlug = issue?.trim().toLowerCase() ?? ''

  const publications = await prisma.publication.findMany({
    where: { status: 'PUBLISHED' },
    include: { issue: true },
  })

  return publications
    .filter((publication: { title: string; abstract?: string | null; authors: string; keywords: string; issue?: { slug: string; title: string } | null }) => {
      const matchesQuery =
        !searchQuery ||
        publication.title.toLowerCase().includes(searchQuery) ||
        (publication.abstract?.toLowerCase().includes(searchQuery) ?? false) ||
        publication.authors.toLowerCase().includes(searchQuery) ||
        publication.keywords.toLowerCase().includes(searchQuery)

      const matchesIssue =
        !issueSlug || publication.issue?.slug.toLowerCase() === issueSlug

      return matchesQuery && matchesIssue
    })
    .map((pub: { slug: string; title: string; abstract?: string | null; authors: string; keywords: string; publishedAt?: Date | null; pdfUrl?: string | null; doi?: string | null; issue?: { slug: string; title: string } | null }) => ({
      slug: pub.slug,
      title: pub.title,
      abstract: pub.abstract ?? '',
      authors: pub.authors.split(',').map((a) => a.trim()),
      keywords: pub.keywords.split(',').map((k) => k.trim()),
      publishedAt: pub.publishedAt?.toISOString().split('T')[0] ?? '',
      issueSlug: pub.issue?.slug ?? '',
      issueTitle: pub.issue?.title ?? '',
      pdfUrl: pub.pdfUrl ?? '',
      doi: pub.doi ?? '',
      category: 'Research',
    }))
}

export async function getPublicationBySlug(slug: string) {
  const publication = await prisma.publication.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: { issue: true },
  })

  if (!publication) {
    return null
  }

  return {
    slug: publication.slug,
    title: publication.title,
    abstract: publication.abstract ?? '',
    authors: publication.authors.split(',').map((a: string) => a.trim()),
    keywords: publication.keywords.split(',').map((k: string) => k.trim()),
    publishedAt: publication.publishedAt?.toISOString().split('T')[0] ?? '',
    issueSlug: publication.issue?.slug ?? '',
    issueTitle: publication.issue?.title ?? '',
    pdfUrl: publication.pdfUrl ?? '',
    doi: publication.doi ?? '',
    category: 'Research',
  }
}

export async function getAdminDashboardSummary() {
  const [pages, issues, publications, news, events, gallery, downloads, currentIssue] =
    await Promise.all([
      prisma.staticPage.count({ where: { status: 'PUBLISHED' } }),
      prisma.issue.count({ where: { status: 'PUBLISHED' } }),
      prisma.publication.count({ where: { status: 'PUBLISHED' } }),
      prisma.newsPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.event.count({ where: { status: 'PUBLISHED' } }),
      prisma.galleryItem.count({ where: { status: 'PUBLISHED' } }),
      prisma.download.count({ where: { status: 'PUBLISHED' } }),
      prisma.issue.findFirst({ where: { isCurrent: true, status: 'PUBLISHED' } }),
    ])

  return {
    contentAreas: 10,
    pages,
    issues,
    publications,
    news,
    events,
    gallery,
    downloads,
    editorialBoardMembers: 2,
    currentIssueTitle: currentIssue?.title ?? 'Not set',
  }
}
