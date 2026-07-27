import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'

import { useAdmin } from '@/components/admin/use-admin'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { uploadImageFile, uploadPublicationFile, type AdminContentSnapshot } from '@/lib/api/admin-api'
import type {
  DownloadItem,
  EditorialBoardMember,
  EventItem,
  GalleryItem,
  Issue,
  NewsItem,
  Publication,
  StaticPage,
} from '@/lib/public-content'

type AdminModuleKey =
  | 'homepage'
  | 'journal-info'
  | 'issues'
  | 'archives'
  | 'publications'
  | 'editorial-board'
  | 'news'
  | 'events'
  | 'gallery'
  | 'downloads'
  | 'contacts'
  | 'branding'

type AdminContentManagerPageProps = {
  moduleKey: AdminModuleKey
}

function FieldLabel({
  children,
  description,
}: {
  children: string
  description?: string
}) {
  return (
    <label className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-foreground">{children}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </label>
  )
}

function TextareaField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ${props.className ?? ''}`}
    />
  )
}

function ExpandableItem({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <details className="group rounded-3xl border border-border/70 bg-card shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <div><p className="font-semibold text-foreground">{title}</p><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground group-open:hidden">Open</span>
        <span className="hidden rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground group-open:inline">Close</span>
      </summary>
      <div className="border-t border-border/70 p-1">{children}</div>
    </details>
  )
}

function splitCommaSeparated(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function createEmptyIssue(): Issue {
  return {
    slug: `issue-${Date.now()}`,
    title: 'New issue',
    volume: 1,
    issueNumber: 1,
    publicationDate: new Date().toISOString().slice(0, 10),
    description: 'Describe this publishing cycle.',
    isCurrent: false,
  }
}

function createEmptyPublication(issueSlug: string): Publication {
  return {
    slug: `publication-${Date.now()}`,
    title: 'New publication',
    abstract: 'Add the publication abstract.',
    authors: ['Author Name'],
    keywords: ['Keyword'],
    publishedAt: new Date().toISOString().slice(0, 10),
    issueSlug,
    pdfUrl: '',
    doi: '10.0000/ijabe.new',
    category: 'Research',
  }
}

function createEmptyNews(): NewsItem {
  return {
    slug: `news-${Date.now()}`,
    title: 'New announcement',
    excerpt: 'Summarize the announcement or news item.',
    category: 'Announcement',
    publishedAt: new Date().toISOString().slice(0, 10),
  }
}

function createEmptyEvent(): EventItem {
  return {
    slug: `event-${Date.now()}`,
    title: 'New event',
    summary: 'Describe the activity and why it matters.',
    venue: 'Venue',
    startsAt: new Date().toISOString(),
    status: 'Upcoming',
  }
}

function createEmptyGalleryItem(): GalleryItem {
  return {
    id: `gallery-${Date.now()}`,
    title: 'New gallery image',
    category: 'Gallery',
    imageUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20university%20gallery%20image%20placeholder%2C%20academic%20event%2C%20clean%20institutional%20style&image_size=landscape_16_9',
  }
}

function createEmptyDownload(): DownloadItem {
  return {
    id: `download-${Date.now()}`,
    title: 'New download',
    description: 'Describe the resource or file.',
    category: 'Resource',
    fileUrl: '/downloads/new-resource.pdf',
    fileSize: '100 KB',
  }
}

function createEmptyBoardMember(): EditorialBoardMember {
  return {
    id: `board-${Date.now()}`,
    name: 'New board member',
    role: 'Role',
    affiliation: 'Affiliation',
    summary: 'Add a short member profile.',
    imageUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20editorial%20board%20member%20portrait%2C%20academic%20profile%2C%20clean%20institutional%20background&image_size=portrait_4_3',
  }
}

export function AdminContentManagerPage({
  moduleKey,
}: AdminContentManagerPageProps) {
  const { isContentLoading, isSaving, saveSnapshot, snapshot } = useAdmin()
  const [draft, setDraft] = useState<AdminContentSnapshot>(snapshot)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusTone, setStatusTone] = useState<'success' | 'error'>('success')
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadingPublicationIndex, setUploadingPublicationIndex] = useState<number | null>(null)
  const [isImageUploading, setIsImageUploading] = useState(false)

  useEffect(() => {
    setDraft(structuredClone(snapshot))
  }, [snapshot])

  useEffect(() => {
    setStatusMessage(null)
    setSearchTerm('')
  }, [moduleKey])

  useEffect(() => {
    if (!statusMessage || statusTone === 'error') return
    const timeout = window.setTimeout(() => setStatusMessage(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [statusMessage, statusTone])

  const currentIssueOptions = useMemo(
    () => draft.issues.map((issue) => ({ label: issue.title, value: issue.slug })),
    [draft.issues],
  )

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const supportsSearch = ['issues', 'archives', 'publications', 'news', 'events'].includes(moduleKey)
  const matchesSearch = (...values: string[]) =>
    !normalizedSearchTerm || values.some((value) => value.toLowerCase().includes(normalizedSearchTerm))

  async function handleSave() {
    const snapshotToSave = structuredClone(draft)
    if (snapshotToSave.issues.length === 0) {
      setStatusTone('error')
      setStatusMessage('Add at least one journal issue before saving.')
      return
    }

    const currentIssueIndex = snapshotToSave.issues.findIndex((issue) => issue.isCurrent)
    snapshotToSave.issues = snapshotToSave.issues.map((issue, index) => ({
      ...issue,
      isCurrent: index === (currentIssueIndex >= 0 ? currentIssueIndex : 0),
    }))

    try {
      await saveSnapshot(snapshotToSave)
      setStatusTone('success')
      setStatusMessage('Changes saved successfully.')
    } catch (error) {
      setStatusTone('error')
      setStatusMessage(
        error instanceof Error ? error.message : 'Unable to save changes.',
      )
    }
  }

  function updateDraft(updater: (current: AdminContentSnapshot) => AdminContentSnapshot) {
    setDraft((current) => updater(structuredClone(current)))
  }

  function uploadImage(file: File | undefined, applyUrl: (url: string) => void) {
    if (!file) return
    setIsImageUploading(true)
    void uploadImageFile(file)
      .then(({ fileUrl }) => {
        applyUrl(fileUrl)
      })
      .catch((error: unknown) => {
        setStatusTone('error')
        setStatusMessage(error instanceof Error ? error.message : 'Image upload failed.')
      })
      .finally(() => setIsImageUploading(false))
  }

  function renderPageEditor(page: StaticPage, pageIndex: number) {
    return (
      <Card key={page.slug}>
        <CardHeader>
          <CardTitle className="text-xl">{page.title}</CardTitle>
          <CardDescription>Edit public copy, summaries, and sections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Title</FieldLabel>
              <Input
                onChange={(event) => {
                  const value = event.target.value
                  updateDraft((current) => {
                    current.pages[pageIndex].title = value
                    return current
                  })
                }}
                value={draft.pages[pageIndex].title}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Small heading above the title</FieldLabel>
              <Input
                onChange={(event) => {
                  const value = event.target.value
                  updateDraft((current) => {
                    current.pages[pageIndex].eyebrow = value
                    return current
                  })
                }}
                value={draft.pages[pageIndex].eyebrow}
              />
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>Summary</FieldLabel>
            <TextareaField
              onChange={(event) => {
                const value = event.target.value
                updateDraft((current) => {
                  current.pages[pageIndex].summary = value
                  return current
                })
              }}
              value={draft.pages[pageIndex].summary}
            />
          </div>
          <div className="space-y-4">
            {draft.pages[pageIndex].sections.map((section, sectionIndex) => (
              <div
                key={`${page.slug}-${section.title}-${sectionIndex}`}
                className="rounded-2xl border border-border/70 bg-secondary/30 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-semibold text-foreground">
                    Section {sectionIndex + 1}
                  </p>
                  <Button
                    onClick={() =>
                      updateDraft((current) => {
                        current.pages[pageIndex].sections.splice(sectionIndex, 1)
                        return current
                      })
                    }
                    type="button"
                    variant="ghost"
                  >
                    Remove section
                  </Button>
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <FieldLabel>Section title</FieldLabel>
                    <Input
                      onChange={(event) => {
                        const value = event.target.value
                        updateDraft((current) => {
                          current.pages[pageIndex].sections[sectionIndex].title = value
                          return current
                        })
                      }}
                      value={draft.pages[pageIndex].sections[sectionIndex].title}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Section body</FieldLabel>
                    <TextareaField
                      onChange={(event) => {
                        const value = event.target.value
                        updateDraft((current) => {
                          current.pages[pageIndex].sections[sectionIndex].body = value
                          return current
                        })
                      }}
                      value={draft.pages[pageIndex].sections[sectionIndex].body}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel description="Separate each point with a comma.">
                      Bullet points
                    </FieldLabel>
                    <Input
                      onChange={(event) => {
                        const value = splitCommaSeparated(event.target.value)
                        updateDraft((current) => {
                          current.pages[pageIndex].sections[sectionIndex].bulletPoints =
                            value
                          return current
                        })
                      }}
                      value={
                        draft.pages[pageIndex].sections[sectionIndex].bulletPoints?.join(
                          ', ',
                        ) ?? ''
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() =>
                updateDraft((current) => {
                  current.pages[pageIndex].sections.push({
                    title: 'New section',
                    body: 'Add section content.',
                    bulletPoints: ['Point one'],
                  })
                  return current
                })
              }
              type="button"
              variant="secondary"
            >
              Add section
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  function renderIssueEditor(issue: Issue, issueIndex: number) {
    return (
      <Card key={issue.slug}>
        <CardHeader>
          <CardTitle className="text-xl">{issue.title}</CardTitle>
          <CardDescription>Publication edition details shown on the website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Issue title</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.issues[issueIndex].title = event.target.value
                    return current
                  })
                }
                value={draft.issues[issueIndex].title}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel description="This is the short web address used for this issue.">Website address</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    const previousSlug = current.issues[issueIndex].slug
                    const nextSlug = event.target.value
                    current.issues[issueIndex].slug = nextSlug
                    current.publications = current.publications.map((publication) =>
                      publication.issueSlug === previousSlug
                        ? { ...publication, issueSlug: nextSlug }
                        : publication,
                    )
                    return current
                  })
                }
                value={draft.issues[issueIndex].slug}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <FieldLabel>Volume</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.issues[issueIndex].volume = Number(event.target.value || 0)
                    return current
                  })
                }
                type="number"
                value={draft.issues[issueIndex].volume}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Issue number</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.issues[issueIndex].issueNumber = Number(
                      event.target.value || 0,
                    )
                    return current
                  })
                }
                type="number"
                value={draft.issues[issueIndex].issueNumber}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Publication date</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.issues[issueIndex].publicationDate = event.target.value
                    return current
                  })
                }
                value={draft.issues[issueIndex].publicationDate}
              />
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>Description</FieldLabel>
            <TextareaField
              onChange={(event) =>
                updateDraft((current) => {
                  current.issues[issueIndex].description = event.target.value
                  return current
                })
              }
              value={draft.issues[issueIndex].description}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-secondary/20 px-4 py-3">
            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                checked={draft.issues[issueIndex].isCurrent}
                onChange={() =>
                  updateDraft((current) => {
                    current.issues = current.issues.map((item, index) => ({
                      ...item,
                      isCurrent: index === issueIndex,
                    }))
                    current.publications = current.publications.map((publication) =>
                      publication.issueSlug === issue.slug
                        ? { ...publication, issueSlug: current.issues[issueIndex].slug }
                        : publication,
                    )
                    return current
                  })
                }
                type="radio"
              />
              Mark as current issue
            </label>
            <Button
              onClick={() => {
                if (draft.issues.length === 1) {
                  setStatusTone('error')
                  setStatusMessage('At least one journal issue is required.')
                  return
                }

                updateDraft((current) => {
                  const removedIssue = current.issues[issueIndex]
                  const remainingIssues = current.issues.filter((_, index) => index !== issueIndex)
                  const replacementIssue =
                    remainingIssues.find((item) => item.isCurrent) ?? remainingIssues[0]

                  current.issues = remainingIssues.map((item, index) => ({
                    ...item,
                    isCurrent: item.isCurrent || index === 0,
                  }))
                  current.publications = current.publications.map((publication) =>
                    publication.issueSlug === removedIssue.slug
                      ? { ...publication, issueSlug: replacementIssue.slug }
                      : publication,
                  )
                  return current
                })
                setStatusTone('success')
                setStatusMessage('Issue removed. Its articles were moved to the remaining current issue.')
              }}
              type="button"
              variant="ghost"
            >
              Remove issue
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  function renderPublicationEditor(publication: Publication, publicationIndex: number) {
    return (
      <Card key={publication.slug}>
        <CardHeader>
          <CardTitle className="text-xl">{publication.title}</CardTitle>
          <CardDescription>Article details, its issue relationship, and its reading or download file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Title</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.publications[publicationIndex].title = event.target.value
                    return current
                  })
                }
                value={draft.publications[publicationIndex].title}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel description="This is the short web address used for this article.">Website address</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.publications[publicationIndex].slug = event.target.value
                    return current
                  })
                }
                value={draft.publications[publicationIndex].slug}
              />
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>Abstract</FieldLabel>
            <TextareaField
              onChange={(event) =>
                updateDraft((current) => {
                  current.publications[publicationIndex].abstract = event.target.value
                  return current
                })
              }
              value={draft.publications[publicationIndex].abstract}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel description="Add each author's name separately.">
                Authors
              </FieldLabel>
              <div className="space-y-2">
                {draft.publications[publicationIndex].authors.map((author, authorIndex) => (
                  <div key={`${publication.slug}-author-${authorIndex}`} className="flex gap-2">
                    <Input onChange={(event) => updateDraft((current) => { current.publications[publicationIndex].authors[authorIndex] = event.target.value; return current })} value={author} />
                    <Button onClick={() => updateDraft((current) => { current.publications[publicationIndex].authors.splice(authorIndex, 1); return current })} type="button" variant="ghost">Remove</Button>
                  </div>
                ))}
                <Button onClick={() => updateDraft((current) => { current.publications[publicationIndex].authors.push(''); return current })} type="button" variant="secondary">Add author</Button>
              </div>
            </div>
            <div className="space-y-2">
              <FieldLabel description="Add each keyword separately.">
                Keywords
              </FieldLabel>
              <div className="space-y-2">
                {draft.publications[publicationIndex].keywords.map((keyword, keywordIndex) => (
                  <div key={`${publication.slug}-keyword-${keywordIndex}`} className="flex gap-2">
                    <Input onChange={(event) => updateDraft((current) => { current.publications[publicationIndex].keywords[keywordIndex] = event.target.value; return current })} value={keyword} />
                    <Button onClick={() => updateDraft((current) => { current.publications[publicationIndex].keywords.splice(keywordIndex, 1); return current })} type="button" variant="ghost">Remove</Button>
                  </div>
                ))}
                <Button onClick={() => updateDraft((current) => { current.publications[publicationIndex].keywords.push(''); return current })} type="button" variant="secondary">Add keyword</Button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel description="Every article must be assigned to the journal issue where it was published.">Journal issue</FieldLabel>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                onChange={(event) =>
                  updateDraft((current) => {
                    current.publications[publicationIndex].issueSlug =
                      event.target.value
                    return current
                  })
                }
                value={draft.publications[publicationIndex].issueSlug}
              >
                {currentIssueOptions.map((issue) => (
                  <option key={issue.value} value={issue.value}>
                    {issue.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <FieldLabel>Category</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.publications[publicationIndex].category =
                      event.target.value
                    return current
                  })
                }
                value={draft.publications[publicationIndex].category}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <FieldLabel>Publication date</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.publications[publicationIndex].publishedAt =
                      event.target.value
                    return current
                  })
                }
                value={draft.publications[publicationIndex].publishedAt}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel description="Optional academic reference number.">DOI (optional)</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.publications[publicationIndex].doi = event.target.value
                    return current
                  })
                }
                value={draft.publications[publicationIndex].doi}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel description="Choose the article PDF from your device.">Article PDF</FieldLabel>
              <Input accept="application/pdf" disabled={uploadingPublicationIndex === publicationIndex} onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                setUploadingPublicationIndex(publicationIndex)
                void uploadPublicationFile(file).then(({ fileUrl }) => {
                  updateDraft((current) => { current.publications[publicationIndex].pdfUrl = fileUrl; return current })
                  setStatusTone('success'); setStatusMessage('Article file selected and ready to save.')
                }).catch((error: unknown) => { setStatusTone('error'); setStatusMessage(error instanceof Error ? error.message : 'Upload failed.') }).finally(() => setUploadingPublicationIndex(null))
              }} type="file" />
              {uploadingPublicationIndex === publicationIndex && <p className="text-xs text-muted-foreground">Uploading PDF…</p>}
            </div>
          </div>
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.publications.splice(publicationIndex, 1)
                return current
              })
            }
            type="button"
            variant="ghost"
          >
            Remove publication
          </Button>
        </CardContent>
      </Card>
    )
  }

  function renderNewsEditor(item: NewsItem, index: number) {
    return (
      <Card key={item.slug}>
        <CardHeader>
          <CardTitle className="text-xl">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.news[index].title = event.target.value
                  return current
                })
              }
              value={draft.news[index].title}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.news[index].slug = event.target.value
                  return current
                })
              }
              value={draft.news[index].slug}
            />
          </div>
          <TextareaField
            onChange={(event) =>
              updateDraft((current) => {
                current.news[index].excerpt = event.target.value
                return current
              })
            }
            value={draft.news[index].excerpt}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.news[index].category = event.target.value
                  return current
                })
              }
              value={draft.news[index].category}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.news[index].publishedAt = event.target.value
                  return current
                })
              }
              value={draft.news[index].publishedAt}
            />
          </div>
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.news.splice(index, 1)
                return current
              })
            }
            type="button"
            variant="ghost"
          >
            Remove news item
          </Button>
        </CardContent>
      </Card>
    )
  }

  function renderEventEditor(item: EventItem, index: number) {
    return (
      <Card key={item.slug}>
        <CardHeader>
          <CardTitle className="text-xl">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.events[index].title = event.target.value
                  return current
                })
              }
              value={draft.events[index].title}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.events[index].slug = event.target.value
                  return current
                })
              }
              value={draft.events[index].slug}
            />
          </div>
          <TextareaField
            onChange={(event) =>
              updateDraft((current) => {
                current.events[index].summary = event.target.value
                return current
              })
            }
            value={draft.events[index].summary}
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.events[index].venue = event.target.value
                  return current
                })
              }
              value={draft.events[index].venue}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.events[index].startsAt = event.target.value
                  return current
                })
              }
              value={draft.events[index].startsAt}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onChange={(event) =>
                updateDraft((current) => {
                  current.events[index].status = event.target.value as EventItem['status']
                  return current
                })
              }
              value={draft.events[index].status}
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.events.splice(index, 1)
                return current
              })
            }
            type="button"
            variant="ghost"
          >
            Remove event
          </Button>
        </CardContent>
      </Card>
    )
  }

  function renderGalleryEditor(item: GalleryItem, index: number) {
    return (
      <Card key={item.id}>
        <CardHeader>
          <CardTitle className="text-xl">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.gallery[index].title = event.target.value
                  return current
                })
              }
              value={draft.gallery[index].title}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.gallery[index].category = event.target.value
                  return current
                })
              }
              value={draft.gallery[index].category}
            />
          </div>
          <Input
            onChange={(event) =>
              updateDraft((current) => {
                current.gallery[index].imageUrl = event.target.value
                return current
              })
            }
            value={draft.gallery[index].imageUrl}
          />
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.gallery.splice(index, 1)
                return current
              })
            }
            type="button"
            variant="ghost"
          >
            Remove gallery item
          </Button>
        </CardContent>
      </Card>
    )
  }

  function renderDownloadEditor(item: DownloadItem, index: number) {
    return (
      <Card key={item.id}>
        <CardHeader>
          <CardTitle className="text-xl">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.downloads[index].title = event.target.value
                  return current
                })
              }
              value={draft.downloads[index].title}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.downloads[index].category = event.target.value
                  return current
                })
              }
              value={draft.downloads[index].category}
            />
          </div>
          <TextareaField
            onChange={(event) =>
              updateDraft((current) => {
                current.downloads[index].description = event.target.value
                return current
              })
            }
            value={draft.downloads[index].description}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.downloads[index].fileUrl = event.target.value
                  return current
                })
              }
              value={draft.downloads[index].fileUrl}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.downloads[index].fileSize = event.target.value
                  return current
                })
              }
              value={draft.downloads[index].fileSize}
            />
          </div>
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.downloads.splice(index, 1)
                return current
              })
            }
            type="button"
            variant="ghost"
          >
            Remove download
          </Button>
        </CardContent>
      </Card>
    )
  }

  function renderBoardMemberEditor(item: EditorialBoardMember, index: number) {
    return (
      <Card key={item.id}>
        <CardHeader>
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <CardDescription>Visible board profile and replaceable portrait.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.editorialBoardMembers[index].name = event.target.value
                  return current
                })
              }
              value={draft.editorialBoardMembers[index].name}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.editorialBoardMembers[index].role = event.target.value
                  return current
                })
              }
              value={draft.editorialBoardMembers[index].role}
            />
          </div>
          <Input
            onChange={(event) =>
              updateDraft((current) => {
                current.editorialBoardMembers[index].affiliation = event.target.value
                return current
              })
            }
            value={draft.editorialBoardMembers[index].affiliation}
          />
          <TextareaField
            onChange={(event) =>
              updateDraft((current) => {
                current.editorialBoardMembers[index].summary = event.target.value
                return current
              })
            }
            value={draft.editorialBoardMembers[index].summary}
          />
          <Input
            onChange={(event) =>
              updateDraft((current) => {
                current.editorialBoardMembers[index].imageUrl = event.target.value
                return current
              })
            }
            value={draft.editorialBoardMembers[index].imageUrl}
          />
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.editorialBoardMembers.splice(index, 1)
                return current
              })
            }
            type="button"
            variant="ghost"
          >
            Remove board member
          </Button>
        </CardContent>
      </Card>
    )
  }

  const moduleConfig = {
    'homepage': {
      title: 'Homepage management',
      description:
        'Update the main homepage heading, introduction, and public information.',
    },
    'journal-info': {
      title: 'Journal information',
      description:
        'Manage the About IJABE and About Research Unit pages without editing code.',
    },
    issues: {
      title: 'Issue management',
      description:
        'Control the active publishing cycle and issue details shown across the public site.',
    },
    archives: {
      title: 'Archive management',
      description:
        'Review and maintain the non-current issues shown in the archive experience.',
    },
    publications: {
      title: 'Article management',
      description:
        'Upload articles, assign them to journal issues, and manage article details and download files.',
    },
    'editorial-board': {
      title: 'Editorial board management',
      description:
        'Edit the editorial board page and maintain public-facing member profiles.',
    },
    news: {
      title: 'News management',
      description: 'Publish announcements and institutional research updates.',
    },
    events: {
      title: 'Event management',
      description: 'Maintain upcoming and completed event records.',
    },
    gallery: {
      title: 'Gallery management',
      description: 'Replace gallery media and image metadata from the dashboard.',
    },
    downloads: {
      title: 'Download management',
      description: 'Keep forms, guides, and public resources current.',
    },
    contacts: {
      title: 'Contact management',
      description: 'Update public contact channels, office details, and support routes.',
    },
    branding: {
      title: 'Branding and leadership',
      description:
        'Manage logos, homepage images, and key institutional leadership profiles.',
    },
  }[moduleKey]

  if (isContentLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Loading information</CardTitle>
          <CardDescription>
            Fetching the latest information for your admin area.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div>
              <CardTitle className="text-3xl">{moduleConfig.title}</CardTitle>
              <CardDescription className="mt-2 max-w-3xl text-base">
                {moduleConfig.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setDraft(structuredClone(snapshot))
                setStatusTone('success')
                setStatusMessage('Unsaved changes were cleared.')
              }}
              type="button"
              variant="secondary"
            >
              Undo unsaved changes
            </Button>
            <Button disabled={isSaving} onClick={() => void handleSave()} type="button">
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </CardHeader>
        {statusMessage && (
          <CardContent>
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                statusTone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-destructive/30 bg-destructive/10 text-destructive'
              }`}
            >
              {statusMessage}
            </div>
          </CardContent>
        )}
      </Card>

      {supportsSearch && (
        <Input
          aria-label="Search this section"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by title, name, issue, or keyword"
          value={searchTerm}
        />
      )}

      {moduleKey === 'homepage' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Homepage content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <FieldLabel>Main homepage heading</FieldLabel>
              <Input
                onChange={(event) =>
                  updateDraft((current) => {
                    current.homepage.heroTitle = event.target.value
                    return current
                  })
                }
                value={draft.homepage.heroTitle}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Short introduction</FieldLabel>
              <TextareaField
                onChange={(event) =>
                  updateDraft((current) => {
                    current.homepage.heroSummary = event.target.value
                    return current
                  })
                }
                value={draft.homepage.heroSummary}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {moduleKey === 'journal-info' &&
        draft.pages
          .filter((page) => page.slug !== 'editorial-board')
          .map((page) => renderPageEditor(page, draft.pages.findIndex((item) => item.slug === page.slug)))}

      {(moduleKey === 'issues' || moduleKey === 'archives') && (
        <>
          {draft.issues
            .filter((issue) => (moduleKey === 'issues' ? true : !issue.isCurrent))
            .filter((issue) => matchesSearch(issue.title, issue.slug, String(issue.volume), String(issue.issueNumber)))
            .map((issue) => <ExpandableItem key={issue.slug} description={`Volume ${issue.volume}, Issue ${issue.issueNumber}`} title={issue.title}>{renderIssueEditor(issue, draft.issues.findIndex((item) => item.slug === issue.slug))}</ExpandableItem>)}
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.issues.push(createEmptyIssue())
                return current
              })
            }
            type="button"
            variant="secondary"
          >
            Add issue
          </Button>
        </>
      )}

      {moduleKey === 'publications' && (
        <>
          {draft.publications.filter((publication) => matchesSearch(publication.title, publication.authors.join(' '), publication.keywords.join(' '), publication.issueSlug)).map((publication) => <ExpandableItem key={publication.slug} description={publication.authors.join(', ')} title={publication.title}>{renderPublicationEditor(publication, draft.publications.findIndex((item) => item.slug === publication.slug))}</ExpandableItem>)}
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.publications.push(
                  createEmptyPublication(current.issues[0]?.slug ?? 'default-issue'),
                )
                return current
              })
            }
            type="button"
            variant="secondary"
          >
            Add article
          </Button>
        </>
      )}

      {moduleKey === 'editorial-board' && (
        <>
          {renderPageEditor(
            draft.pages.find((page) => page.slug === 'editorial-board') ?? draft.pages[0],
            draft.pages.findIndex((page) => page.slug === 'editorial-board'),
          )}
          {draft.editorialBoardMembers.map((member, index) =>
            renderBoardMemberEditor(member, index),
          )}
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.editorialBoardMembers.push(createEmptyBoardMember())
                return current
              })
            }
            type="button"
            variant="secondary"
          >
            Add board member
          </Button>
        </>
      )}

      {moduleKey === 'news' && (
        <>
          {draft.news.filter((item) => matchesSearch(item.title, item.excerpt, item.category)).map((item) => <ExpandableItem key={item.slug} description={item.publishedAt} title={item.title}>{renderNewsEditor(item, draft.news.findIndex((current) => current.slug === item.slug))}</ExpandableItem>)}
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.news.push(createEmptyNews())
                return current
              })
            }
            type="button"
            variant="secondary"
          >
            Add news item
          </Button>
        </>
      )}

      {moduleKey === 'events' && (
        <>
          {draft.events.filter((item) => matchesSearch(item.title, item.summary, item.venue, item.status)).map((item) => <ExpandableItem key={item.slug} description={item.startsAt} title={item.title}>{renderEventEditor(item, draft.events.findIndex((current) => current.slug === item.slug))}</ExpandableItem>)}
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.events.push(createEmptyEvent())
                return current
              })
            }
            type="button"
            variant="secondary"
          >
            Add event
          </Button>
        </>
      )}

      {moduleKey === 'gallery' && (
        <>
          {draft.gallery.map((item, index) => renderGalleryEditor(item, index))}
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.gallery.push(createEmptyGalleryItem())
                return current
              })
            }
            type="button"
            variant="secondary"
          >
            Add gallery item
          </Button>
        </>
      )}

      {moduleKey === 'downloads' && (
        <>
          {draft.downloads.map((item, index) => renderDownloadEditor(item, index))}
          <Button
            onClick={() =>
              updateDraft((current) => {
                current.downloads.push(createEmptyDownload())
                return current
              })
            }
            type="button"
            variant="secondary"
          >
            Add download
          </Button>
        </>
      )}

      {(moduleKey === 'contacts' || moduleKey === 'homepage') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Public contact profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.contact.officeName = event.target.value
                  return current
                })
              }
              value={draft.contact.officeName}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.contact.phone = event.target.value
                  return current
                })
              }
              value={draft.contact.phone}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.contact.email = event.target.value
                  return current
                })
              }
              value={draft.contact.email}
            />
            <Input
              onChange={(event) =>
                updateDraft((current) => {
                  current.contact.supportEmail = event.target.value
                  return current
                })
              }
              value={draft.contact.supportEmail}
            />
            <Input
              className="md:col-span-2"
              onChange={(event) =>
                updateDraft((current) => {
                  current.contact.address = event.target.value
                  return current
                })
              }
              value={draft.contact.address}
            />
            <Input
              className="md:col-span-2"
              onChange={(event) =>
                updateDraft((current) => {
                  current.contact.officeHours = event.target.value
                  return current
                })
              }
              value={draft.contact.officeHours}
            />
          </CardContent>
        </Card>
      )}

      {(moduleKey === 'branding' || moduleKey === 'homepage') && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Branding assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldLabel>University logo</FieldLabel>
              <Input accept="image/jpeg,image/png,image/webp" disabled={isImageUploading} onChange={(event) => uploadImage(event.target.files?.[0], (url) => updateDraft((current) => { current.branding.universityLogoUrl = url; return current }))} type="file" />
              <FieldLabel>Homepage banner</FieldLabel>
              <Input accept="image/jpeg,image/png,image/webp" disabled={isImageUploading} onChange={(event) => uploadImage(event.target.files?.[0], (url) => updateDraft((current) => { current.branding.heroBannerUrl = url; return current }))} type="file" />
              <div className="space-y-2">
                <FieldLabel description="Enter the official journal identifier exactly as issued, for example: ISSN 1234-5678.">Journal ISSN</FieldLabel>
                <Input
                  onChange={(event) => updateDraft((current) => { current.branding.issn = event.target.value; return current })}
                  placeholder="ISSN 1234-5678"
                  value={draft.branding.issn}
                />
              </div>
            </CardContent>
          </Card>

          {(
            [
              ['viceChancellor', 'Vice Chancellor'],
              ['universityManagement', 'Faculty Management'],
              ['researchUnitHead', 'Research Unit Head'],
            ] as const
          ).map(([key, label]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-2xl">{label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    onChange={(event) =>
                      updateDraft((current) => {
                        current.leadership[key].name = event.target.value
                        return current
                      })
                    }
                    value={draft.leadership[key].name}
                  />
                  <Input
                    onChange={(event) =>
                      updateDraft((current) => {
                        current.leadership[key].title = event.target.value
                        return current
                      })
                    }
                    value={draft.leadership[key].title}
                  />
                </div>
                <TextareaField
                  onChange={(event) =>
                    updateDraft((current) => {
                      current.leadership[key].summary = event.target.value
                      return current
                    })
                  }
                  value={draft.leadership[key].summary}
                />
                <FieldLabel>Profile image</FieldLabel>
                <Input accept="image/jpeg,image/png,image/webp" disabled={isImageUploading} onChange={(event) => uploadImage(event.target.files?.[0], (url) => updateDraft((current) => { current.leadership[key].imageUrl = url; return current }))} type="file" />
                {isImageUploading && <p className="text-xs text-muted-foreground">Uploading image…</p>}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}
