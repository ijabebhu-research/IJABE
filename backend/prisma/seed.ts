import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10)
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@ijabe.edu' },
    update: {},
    create: {
      email: 'admin@ijabe.edu',
      passwordHash: adminPasswordHash,
      firstName: 'IJABE',
      lastName: 'Administrator',
      role: 'ADMIN',
      isActive: true,
    },
  })
  console.log('Created admin user:', adminUser.email)

  // Create initial issue
  const issue = await prisma.issue.upsert({
    where: { slug: 'issue-1-2024' },
    update: {},
    create: {
      slug: 'issue-1-2024',
      title: 'Volume 1, Issue 1 - 2024',
      volume: 1,
      issueNumber: 1,
      publicationDate: new Date('2024-01-15'),
      description: 'Inaugural issue of the International Journal of Accounting, Business Administration & Entrepreneurship.',
      isCurrent: true,
      status: 'PUBLISHED',
    },
  })
  console.log('Created issue:', issue.title)

  // Create sample publications
  const publication1 = await prisma.publication.upsert({
    where: { slug: 'accounting-practices-emerging-markets' },
    update: {},
    create: {
      slug: 'accounting-practices-emerging-markets',
      title: 'Accounting Practices in Emerging Markets: A Comparative Analysis',
      abstract: 'This study examines accounting practices across emerging markets, comparing regulatory frameworks and implementation challenges. The research provides insights into how developing economies are adapting international accounting standards.',
      authors: 'John Smith, Maria Garcia, Kwame Osei',
      keywords: 'accounting,emerging markets,regulatory framework,comparative analysis',
      pdfUrl: '/downloads/accounting-practices-emerging-markets.pdf',
      doi: '10.1234/ijabe.2024.001',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-15'),
      issueId: issue.id,
    },
  })
  console.log('Created publication:', publication1.title)

  const publication2 = await prisma.publication.upsert({
    where: { slug: 'entrepreneurship-education-impact' },
    update: {},
    create: {
      slug: 'entrepreneurship-education-impact',
      title: 'The Impact of Entrepreneurship Education on Business Start-up Rates',
      abstract: 'This paper investigates the relationship between entrepreneurship education programs and subsequent business start-up rates among graduates. The findings suggest a positive correlation between structured entrepreneurship training and new venture creation.',
      authors: 'Sarah Johnson, Ahmed Hassan',
      keywords: 'entrepreneurship,education,start-up rates,business creation',
      pdfUrl: '/downloads/entrepreneurship-education-impact.pdf',
      doi: '10.1234/ijabe.2024.002',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-15'),
      issueId: issue.id,
    },
  })
  console.log('Created publication:', publication2.title)

  // Create news items
  const news1 = await prisma.newsPost.upsert({
    where: { slug: 'call-for-papers-2024' },
    update: {},
    create: {
      slug: 'call-for-papers-2024',
      title: 'Call for Papers: Volume 2, Issue 1',
      excerpt: 'We invite submissions for our upcoming issue focusing on sustainable business practices and digital transformation.',
      content: 'The International Journal of Accounting, Business Administration & Entrepreneurship welcomes submissions for Volume 2, Issue 1. We are particularly interested in research addressing sustainable business practices, digital transformation in emerging markets, and innovative entrepreneurship models.',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-06-01'),
    },
  })
  console.log('Created news item:', news1.title)

  // Create events
  const event1 = await prisma.event.upsert({
    where: { slug: 'international-conference-2024' },
    update: {},
    create: {
      slug: 'international-conference-2024',
      title: 'IJABE International Conference 2024',
      summary: 'Annual conference bringing together researchers and practitioners in accounting, business administration, and entrepreneurship.',
      content: 'Join us for the IJABE International Conference 2024, featuring keynote speakers from leading academic institutions and industry leaders. The conference will include paper presentations, workshops, and networking opportunities.',
      venue: 'University Conference Center, Lagos',
      startsAt: new Date('2024-11-15T09:00:00Z'),
      endsAt: new Date('2024-11-17T17:00:00Z'),
      status: 'UPCOMING',
    },
  })
  console.log('Created event:', event1.title)

  // Create gallery items
  const gallery1 = await prisma.galleryItem.upsert({
    where: { id: 'gallery-1' },
    update: {},
    create: {
      id: 'gallery-1',
      title: 'Conference 2023 Highlights',
      imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20academic%20conference%20photo%2C%20diverse%20group%20of%20researchers%20networking%2C%20modern%20conference%20hall&image_size=landscape_16_9',
      description: 'Highlights from our successful 2023 international conference.',
      status: 'PUBLISHED',
    },
  })
  console.log('Created gallery item:', gallery1.title)

  // Create downloads
  const download1 = await prisma.download.upsert({
    where: { id: 'download-1' },
    update: {},
    create: {
      id: 'download-1',
      title: 'Author Guidelines',
      description: 'This document provides detailed guidelines for manuscript preparation, submission procedures, and the peer review process.',
      fileUrl: '/downloads/author-guidelines.pdf',
      status: 'PUBLISHED',
    },
  })
  console.log('Created download:', download1.title)

  // Create static pages
  const aboutPage = await prisma.staticPage.upsert({
    where: { slug: 'about-ijabe' },
    update: {},
    create: {
      slug: 'about-ijabe',
      title: 'About IJABE',
      excerpt: 'International Journal of Accounting, Business Administration & Entrepreneurship',
      content: 'The International Journal of Accounting, Business Administration & Entrepreneurship (IJABE) is a peer-reviewed academic journal dedicated to advancing research in accounting, business administration, and entrepreneurship.',
      status: 'PUBLISHED',
    },
  })
  console.log('Created static page:', aboutPage.title)

  const researchUnitPage = await prisma.staticPage.upsert({
    where: { slug: 'about-research-unit' },
    update: {},
    create: {
      slug: 'about-research-unit',
      title: 'About the Research Unit',
      excerpt: 'Our mission is to foster excellence in business research and education.',
      content: 'The Research Unit serves as the academic backbone of IJABE, supporting rigorous research methodologies and promoting interdisciplinary collaboration among scholars.',
      status: 'PUBLISHED',
    },
  })
  console.log('Created static page:', researchUnitPage.title)

  const editorialBoardPage = await prisma.staticPage.upsert({
    where: { slug: 'editorial-board' },
    update: {},
    create: {
      slug: 'editorial-board',
      title: 'Editorial Board',
      excerpt: 'Meet our distinguished editorial board members.',
      content: 'Our editorial board comprises leading scholars and practitioners from around the world, ensuring the highest standards of academic rigor and relevance.',
      status: 'PUBLISHED',
    },
  })
  console.log('Created static page:', editorialBoardPage.title)

  // Create site settings
  await prisma.siteSetting.upsert({
    where: { key: 'homepage_hero_title' },
    update: {},
    create: {
      key: 'homepage_hero_title',
      value: 'Advancing Knowledge in Accounting, Business & Entrepreneurship',
      description: 'Main hero title for homepage',
    },
  })

  await prisma.siteSetting.upsert({
    where: { key: 'homepage_hero_summary' },
    update: {},
    create: {
      key: 'homepage_hero_summary',
      value: 'A peer-reviewed international journal dedicated to excellence in research and practice across accounting, business administration, and entrepreneurship.',
      description: 'Hero summary text for homepage',
    },
  })

  console.log('Site settings created')

  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
