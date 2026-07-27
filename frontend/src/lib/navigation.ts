export type PublicPageDefinition = {
  path: string
  label: string
  title: string
  eyebrow: string
  description: string
  highlights: string[]
}

export const primaryNavItems = [
  { label: 'Home', path: '/' },
  { label: 'About IJABE', path: '/about-ijabe' },
  { label: 'Publications', path: '/research-repository' },
  { label: 'News', path: '/news' },
  { label: 'Conferences', path: '/events' },
  { label: 'Contact', path: '/contact' },
]

export const publicPages: PublicPageDefinition[] = [
  {
    path: '/about-ijabe',
    label: 'About IJABE',
    title: 'About The Journal',
    eyebrow: 'Journal Profile',
    description:
      'This section will present the journal scope, aims, publication standards, and the value IJABE brings to accounting, business administration, and entrepreneurship research.',
    highlights: ['Journal mission and scope', 'Publishing standards', 'Why researchers choose IJABE'],
  },
  {
    path: '/about-research-unit',
    label: 'About Research Unit',
    title: 'About The Research Unit',
    eyebrow: 'Institutional Context',
    description:
      'This page shell is prepared for the institutional story, mandate, strategic priorities, and the research unit leadership profile.',
    highlights: ['Mandate and goals', 'Leadership narrative', 'Institutional credibility'],
  },
  {
    path: '/editorial-board',
    label: 'Editorial Board',
    title: 'Editorial Leadership',
    eyebrow: 'People And Governance',
    description:
      'The public editorial board experience will highlight expertise, roles, and credibility while leaving final content fully manageable from the admin dashboard.',
    highlights: ['Editor profiles', 'Role groupings', 'Replaceable portraits and bios'],
  },
  {
    path: '/current-issue',
    label: 'Current Issue',
    title: 'Current Issue Overview',
    eyebrow: 'Latest Publication Cycle',
    description:
      'The current issue layout will foreground issue metadata, featured articles, downloadable files, and clear access to publication details.',
    highlights: ['Issue metadata', 'Featured article cards', 'Direct download actions'],
  },
  {
    path: '/archives',
    label: 'Archives',
    title: 'Browse The Archives',
    eyebrow: 'Historical Record',
    description:
      'The archive view is planned as a structured year-volume-issue browsing experience to make back issues easy to explore and search.',
    highlights: ['Year and volume grouping', 'Archive issue cards', 'Long-term discoverability'],
  },
  {
    path: '/research-repository',
    label: 'Research Repository',
    title: 'Research Repository',
    eyebrow: 'Publication Discovery',
    description:
      'The repository foundation is designed for searchable publication records with metadata, abstracts, and downloadable research outputs.',
    highlights: ['Searchable metadata', 'Repository cards', 'Future filters and tags'],
  },
  {
    path: '/news',
    label: 'News',
    title: 'Research And Journal News',
    eyebrow: 'Announcements',
    description:
      'The news section will support structured article cards, featured announcements, and date-based browsing for institutional updates.',
    highlights: ['Featured news hero', 'News archive feed', 'Content-managed headlines'],
  },
  {
    path: '/events',
    label: 'Events',
    title: 'Events And Activities',
    eyebrow: 'Community Engagement',
    description:
      'This page shell prepares for upcoming and past event listings with event details, dates, locations, and promotional imagery.',
    highlights: ['Upcoming events', 'Past event archive', 'Admin-managed event highlights'],
  },
  {
    path: '/gallery',
    label: 'Gallery',
    title: 'Media Gallery',
    eyebrow: 'Visual Storytelling',
    description:
      'The gallery foundation supports replaceable institutional and journal imagery with room for categorized albums later.',
    highlights: ['Responsive image grid', 'Admin-replaceable assets', 'Future album support'],
  },
  {
    path: '/downloads',
    label: 'Downloads',
    title: 'Downloads And Resources',
    eyebrow: 'Supporting Material',
    description:
      'The downloads section will hold forms, policies, templates, and supplementary resources in a clean, admin-controlled listing.',
    highlights: ['Resource categories', 'Version-ready file cards', 'Simple access patterns'],
  },
  {
    path: '/contact',
    label: 'Contact',
    title: 'Contact The Research Unit',
    eyebrow: 'Reach The Team',
    description:
      'The contact experience will combine essential contact information, office details, and a guided contact form for public enquiries.',
    highlights: ['Contact summary', 'Office details', 'Public enquiry workflow'],
  },
]

export const searchHighlights = [
  'Keyword search across publications',
  'Issue-aware filtering and metadata discovery',
  'Fast access to article detail and downloads',
]

export type AdminNavItem = {
  label: string
  path: string
  description: string
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    description: 'A simple overview of your IJABE content',
  },
  {
    label: 'Site details',
    path: '/admin/homepage',
    description: 'Homepage, contact details, branding and management profiles',
  },
  {
    label: 'Journal issues',
    path: '/admin/issues',
    description: 'Create and edit the volume, issue number, date, and issue details',
  },
  {
    label: 'Publications',
    path: '/admin/publications',
    description: 'Upload, edit, and make publications available for reading or download',
  },
  {
    label: 'News',
    path: '/admin/news',
    description: 'Announcements and institutional updates',
  },
  {
    label: 'Conferences',
    path: '/admin/events',
    description: 'Upcoming and completed activities',
  },
  {
    label: 'Applicants',
    path: '/admin/applicants',
    description: 'Review conference applications and reply by email',
  },
  {
    label: 'Enquiries',
    path: '/admin/enquiries',
    description: 'Read and reply to messages from the public contact page',
  },
  {
    label: 'Administrator account',
    path: '/admin/account',
    description: 'Update the administrator name, sign-in email, or password',
  },
]
