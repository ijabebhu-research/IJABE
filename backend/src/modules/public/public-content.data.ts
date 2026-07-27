export type PublicationRecord = {
  slug: string
  title: string
  abstract: string
  authors: string[]
  keywords: string[]
  publishedAt: string
  issueSlug: string
  pdfUrl: string
  doi: string
  category: string
}

export type IssueRecord = {
  slug: string
  title: string
  volume: number
  issueNumber: number
  publicationDate: string
  description: string
  isCurrent: boolean
}

type StaticPageSection = {
  title: string
  body: string
  bulletPoints?: string[]
}

type StaticPageRecord = {
  slug: string
  title: string
  eyebrow: string
  summary: string
  sections: StaticPageSection[]
}

type NewsRecord = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
}

type EventRecord = {
  slug: string
  title: string
  summary: string
  venue: string
  startsAt: string
  status: 'Upcoming' | 'Completed'
}

type GalleryRecord = {
  id: string
  title: string
  category: string
  imageUrl: string
}

type DownloadRecord = {
  id: string
  title: string
  description: string
  category: string
  fileUrl: string
  fileSize: string
}

export type BrandingContent = {
  universityLogoUrl: string
  journalLogoUrl: string
  heroBannerUrl: string
}

export type LeadershipProfile = {
  id: string
  name: string
  title: string
  summary: string
  imageUrl: string
}

export type LeadershipContent = {
  viceChancellor: LeadershipProfile
  universityManagement: LeadershipProfile
  researchUnitHead: LeadershipProfile
}

export type EditorialBoardMember = {
  id: string
  name: string
  role: string
  affiliation: string
  summary: string
  imageUrl: string
}

export const publications: PublicationRecord[] = [
  {
    slug: 'digital-accountability-in-public-finance',
    title: 'Digital Accountability Practices in Public Finance Management',
    abstract:
      'This study examines how digital reporting systems influence fiscal transparency, accountability behaviour, and decision-making across public finance institutions.',
    authors: ['Grace O. Nwafor', 'Peter M. Danjuma'],
    keywords: ['Public Finance', 'Digital Reporting', 'Accountability'],
    publishedAt: '2026-06-20',
    issueSlug: 'volume-8-issue-1',
    pdfUrl: '/downloads/digital-accountability.pdf',
    doi: '10.0000/ijabe.2026.001',
    category: 'Accounting',
  },
  {
    slug: 'entrepreneurship-education-and-startup-readiness',
    title: 'Entrepreneurship Education and Startup Readiness Among University Graduates',
    abstract:
      'The article evaluates how entrepreneurship curricula shape startup confidence, venture preparedness, and innovation culture among final-year graduates.',
    authors: ['Amina S. Ibrahim', 'Rachael T. Samuel'],
    keywords: ['Entrepreneurship', 'Higher Education', 'Startups'],
    publishedAt: '2026-06-20',
    issueSlug: 'volume-8-issue-1',
    pdfUrl: '/downloads/startup-readiness.pdf',
    doi: '10.0000/ijabe.2026.002',
    category: 'Entrepreneurship',
  },
  {
    slug: 'leadership-culture-and-sme-performance',
    title: 'Leadership Culture and SME Performance in Emerging Markets',
    abstract:
      'This paper explores the relationship between leadership culture, people systems, and sustained operational performance among small and medium-sized enterprises.',
    authors: ['Samuel K. Bako'],
    keywords: ['Leadership', 'SME', 'Performance'],
    publishedAt: '2025-12-15',
    issueSlug: 'volume-7-issue-2',
    pdfUrl: '/downloads/leadership-culture.pdf',
    doi: '10.0000/ijabe.2025.011',
    category: 'Business Administration',
  },
  {
    slug: 'research-commercialisation-in-african-universities',
    title: 'Research Commercialisation Pathways in African Universities',
    abstract:
      'The paper identifies enablers and constraints affecting how research outputs move from academic production to market-facing innovation pathways.',
    authors: ['Lilian E. Madu', 'Joshua A. Peter'],
    keywords: ['Commercialisation', 'Innovation', 'Universities'],
    publishedAt: '2025-06-30',
    issueSlug: 'volume-7-issue-1',
    pdfUrl: '/downloads/research-commercialisation.pdf',
    doi: '10.0000/ijabe.2025.004',
    category: 'Entrepreneurship',
  },
]

export const issues: IssueRecord[] = [
  {
    slug: 'volume-8-issue-1',
    title: 'Volume 8, Issue 1',
    volume: 8,
    issueNumber: 1,
    publicationDate: '2026-06-20',
    description:
      'The current issue focuses on accountability, entrepreneurship readiness, and institution-building for resilient research and business practice.',
    isCurrent: true,
  },
  {
    slug: 'volume-7-issue-2',
    title: 'Volume 7, Issue 2',
    volume: 7,
    issueNumber: 2,
    publicationDate: '2025-12-15',
    description:
      'A thematic issue examining enterprise performance, policy alignment, and leadership systems in fast-changing business environments.',
    isCurrent: false,
  },
  {
    slug: 'volume-7-issue-1',
    title: 'Volume 7, Issue 1',
    volume: 7,
    issueNumber: 1,
    publicationDate: '2025-06-30',
    description:
      'A broad issue dedicated to scholarly publishing quality, innovation ecosystems, and public-sector entrepreneurship opportunities.',
    isCurrent: false,
  },
]

export const staticPages: StaticPageRecord[] = [
  {
    slug: 'about-ijabe',
    title: 'About IJABE',
    eyebrow: 'Journal Profile',
    summary:
      'IJABE advances rigorous scholarship in accounting, business administration, and entrepreneurship while remaining accessible to policy, practice, and the academic community.',
    sections: [
      {
        title: 'Mission',
        body: 'The journal provides a credible platform for high-quality research that speaks to institutional development, enterprise growth, and evidence-based management practice.',
      },
      {
        title: 'Scope',
        body: 'IJABE welcomes empirical, conceptual, and review-based contributions across accounting systems, governance, business strategy, entrepreneurship, and innovation.',
        bulletPoints: ['Accounting and finance', 'Business administration', 'Entrepreneurship and innovation'],
      },
    ],
  },
  {
    slug: 'about-research-unit',
    title: 'About The Research Unit',
    eyebrow: 'Institutional Context',
    summary:
      'The Research Unit coordinates research visibility, scholarly communication, and the dissemination of institutional knowledge through IJABE and related academic activities.',
    sections: [
      {
        title: 'Mandate',
        body: 'The unit supports research culture, editorial quality, academic visibility, and public knowledge access through structured publication and outreach channels.',
      },
      {
        title: 'Leadership Focus',
        body: 'Its current focus is to strengthen publishing standards, archive institutional outputs, and support research that responds to local and regional development priorities.',
      },
    ],
  },
  {
    slug: 'editorial-board',
    title: 'Editorial Board',
    eyebrow: 'People And Governance',
    summary:
      'The editorial board brings together expertise in accounting, entrepreneurship, business administration, and scholarly publishing oversight.',
    sections: [
      {
        title: 'Editorial Structure',
        body: 'The public board presentation will group editorial leadership, advisory support, and specialist contributors to reflect the journal’s governance clearly.',
        bulletPoints: ['Editor-in-Chief', 'Managing Editor', 'Editorial Advisory Members'],
      },
      {
        title: 'Credibility',
        body: 'Board members represent academic depth, editorial judgment, and sector relevance that reinforce confidence in the journal’s publication process.',
      },
    ],
  },
]

export const newsItems: NewsRecord[] = [
  {
    slug: 'call-for-papers-2026',
    title: 'Call for Papers for the 2026 IJABE Publishing Cycle',
    excerpt:
      'IJABE invites original submissions addressing accounting practice, entrepreneurship development, and business innovation.',
    category: 'Announcement',
    publishedAt: '2026-07-01',
  },
  {
    slug: 'research-unit-workshop',
    title: 'Research Unit Hosts Academic Writing and Publishing Workshop',
    excerpt:
      'The workshop focused on publication readiness, metadata quality, and practical strategies for stronger journal submissions.',
    category: 'Workshop',
    publishedAt: '2026-05-18',
  },
]

export const events: EventRecord[] = [
  {
    slug: 'editorial-policy-roundtable',
    title: 'Editorial Policy Roundtable',
    summary:
      'A focused conversation on scholarly quality, journal visibility, and editorial consistency across research outputs.',
    venue: 'Research Unit Conference Room',
    startsAt: '2026-08-14T10:00:00.000Z',
    status: 'Upcoming',
  },
  {
    slug: 'research-showcase-day',
    title: 'Research Showcase Day',
    summary:
      'An institutional showcase of recent publications, innovation outputs, and interdisciplinary research projects.',
    venue: 'University Main Auditorium',
    startsAt: '2026-04-21T09:00:00.000Z',
    status: 'Completed',
  },
]

export const galleryItems: GalleryRecord[] = [
  {
    id: 'gallery-1',
    title: 'Editorial Strategy Session',
    category: 'Editorial',
    imageUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20university%20research%20editorial%20board%20meeting%20in%20a%20modern%20conference%20room%2C%20academic%20team%2C%20clean%20institutional%20setting%2C%20soft%20natural%20lighting&image_size=landscape_16_9',
  },
  {
    id: 'gallery-2',
    title: 'Research Unit Team Portrait',
    category: 'Institution',
    imageUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20research%20unit%20team%20portrait%20at%20a%20university%2C%20formal%20academic%20attire%2C%20modern%20campus%20background%2C%20clean%20editorial%20website%20imagery&image_size=landscape_16_9',
  },
  {
    id: 'gallery-3',
    title: 'Publishing Workshop Session',
    category: 'Workshop',
    imageUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=university%20publishing%20workshop%20with%20researchers%20and%20laptops%2C%20academic%20training%20session%2C%20bright%20seminar%20room%2C%20professional%20event%20photography&image_size=landscape_16_9',
  },
]

export const downloads: DownloadRecord[] = [
  {
    id: 'download-1',
    title: 'Author Submission Template',
    description: 'A structured manuscript template for IJABE submissions.',
    category: 'Template',
    fileUrl: '/downloads/author-template.docx',
    fileSize: '248 KB',
  },
  {
    id: 'download-2',
    title: 'Publication Ethics Guide',
    description: 'Editorial ethics and publication integrity guidance for contributors.',
    category: 'Policy',
    fileUrl: '/downloads/publication-ethics.pdf',
    fileSize: '412 KB',
  },
]

export const contactProfile = {
  officeName: 'IJABE Research Unit',
  email: 'research.unit@ijabe.edu',
  supportEmail: 'editorial.office@ijabe.edu',
  phone: '+234 800 000 0000',
  address: 'Research Unit Building, Main Campus, Bauchi, Nigeria',
  officeHours: 'Monday to Friday, 8:00 AM to 4:00 PM',
}

export const homepageContent = {
  heroTitle: 'Publishing research with clarity, credibility, and public access.',
  heroSummary:
    'IJABE presents current issues, archives, research outputs, institutional updates, and key journal information through a clean, modern public experience.',
  metrics: [
    { label: 'Issues archived', value: '3' },
    { label: 'Featured publications', value: '4' },
    { label: 'Editorial updates', value: '2' },
  ],
}

export const brandingContent: BrandingContent = {
  universityLogoUrl:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=clean%20modern%20university%20logo%20mark%20for%20an%20academic%20institution%2C%20professional%20blue%20and%20gold%20branding%2C%20vector-style%20icon%20on%20white%20background&image_size=square',
  journalLogoUrl:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20journal%20logo%20for%20an%20international%20research%20publication%2C%20minimal%20editorial%20branding%2C%20blue%20accent%2C%20clean%20white%20background&image_size=square',
  heroBannerUrl:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20university%20research%20campus%20banner%20with%20academic%20professionals%2C%20clean%20institutional%20editorial%20website%20hero%20image%2C%20soft%20natural%20light&image_size=landscape_16_9',
}

export const leadershipProfiles: LeadershipContent = {
  viceChancellor: {
    id: 'leadership-vice-chancellor',
    name: 'Prof. Adebayo M. Sule',
    title: 'Vice Chancellor',
    summary:
      'Provides executive leadership for institutional quality, research visibility, and academic partnerships that strengthen the journal ecosystem.',
    imageUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20vice%20chancellor%20portrait%20in%20formal%20academic%20attire%2C%20university%20office%20background%2C%20clean%20institutional%20photography&image_size=portrait_4_3',
  },
  universityManagement: {
    id: 'leadership-university-management',
    name: 'Dr. Hadiza L. Musa',
    title: 'Director of University Management',
    summary:
      'Supports institutional governance, research administration, and operational systems that sustain publication quality and public access.',
    imageUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20university%20management%20leader%20portrait%2C%20formal%20academic%20office%2C%20trustworthy%20institutional%20style&image_size=portrait_4_3',
  },
  researchUnitHead: {
    id: 'leadership-research-unit-head',
    name: 'Dr. Ruth K. Danladi',
    title: 'Head of Research Unit',
    summary:
      'Leads the research unit strategy for scholarly communication, publication quality, and knowledge dissemination through IJABE.',
    imageUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20research%20unit%20head%20portrait%20at%20a%20university%2C%20formal%20attire%2C%20modern%20academic%20environment&image_size=portrait_4_3',
  },
}

export const editorialBoardMembers: EditorialBoardMember[] = [
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
  {
    id: 'board-3',
    name: 'Dr. Amina S. Ibrahim',
    role: 'Editorial Advisory Member',
    affiliation: 'Centre for Entrepreneurship and Innovation',
    summary:
      'Advises on publication quality, interdisciplinary relevance, and entrepreneurship scholarship visibility.',
    imageUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20female%20editorial%20board%20member%20portrait%2C%20academic%20advisor%2C%20clean%20institutional%20style&image_size=portrait_4_3',
  },
]

export function getCurrentIssueWithPublications() {
  const currentIssue = issues.find((issue) => issue.isCurrent)

  if (!currentIssue) {
    return null
  }

  return {
    ...currentIssue,
    publications: publications.filter(
      (publication) => publication.issueSlug === currentIssue.slug,
    ),
  }
}

export function getArchiveIssuesWithCounts() {
  return issues
    .filter((issue) => !issue.isCurrent)
    .map((issue) => ({
      ...issue,
      publicationCount: publications.filter(
        (publication) => publication.issueSlug === issue.slug,
      ).length,
    }))
}
