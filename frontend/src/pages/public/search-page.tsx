import { Search } from 'lucide-react'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'

import { DataStatus } from '@/components/public/data-status'
import { PublicationCard } from '@/components/public/publication-card'
import { Badge } from '@/components/ui/badge'
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
import {
  getArchiveIssues,
  getCurrentIssue,
  getPublications,
} from '@/lib/api/public-api'
import {
  fallbackArchiveIssues,
  fallbackCurrentIssue,
  fallbackPublications,
} from '@/lib/public-content'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [queryInput, setQueryInput] = useState(searchParams.get('q') ?? '')
  const [issueInput, setIssueInput] = useState(searchParams.get('issue') ?? '')

  const query = searchParams.get('q') ?? ''
  const issue = searchParams.get('issue') ?? ''

  const publicationsLoader = useMemo(() => {
    return () => getPublications(query, issue)
  }, [issue, query])

  const publicationsState = usePublicResource(publicationsLoader, fallbackPublications)
  const currentIssueState = usePublicResource(getCurrentIssue, fallbackCurrentIssue)
  const archiveIssuesState = usePublicResource(getArchiveIssues, fallbackArchiveIssues)

  const availableIssues = [
    currentIssueState.data,
    ...archiveIssuesState.data,
  ]

  useEffect(() => {
    setQueryInput(query)
    setIssueInput(issue)
  }, [issue, query])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextParams = new URLSearchParams()

    if (queryInput.trim()) {
      nextParams.set('q', queryInput.trim())
    }

    if (issueInput) {
      nextParams.set('issue', issueInput)
    }

    setSearchParams(nextParams)
  }

  return (
    <div className="space-y-6">
      <DataStatus
        isFallback={
          publicationsState.isFallback ||
          currentIssueState.isFallback ||
          archiveIssuesState.isFallback
        }
        isLoading={
          publicationsState.isLoading ||
          currentIssueState.isLoading ||
          archiveIssuesState.isLoading
        }
      />

      <Card className="border-primary/10">
        <CardHeader className="space-y-4">
          <Badge className="w-fit">Discovery Layer</Badge>
          <CardTitle className="text-4xl">Search publications and journal resources.</CardTitle>
          <CardDescription className="max-w-3xl text-base">
            Search across titles, abstracts, authors, and keywords, then narrow the
            results by issue when needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 lg:flex-row" onSubmit={handleSearch}>
            <Input
              aria-label="Search query"
              className="h-12 bg-white"
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Try title, author, abstract keyword, or topic"
              value={queryInput}
            />
            <select
              aria-label="Filter by issue"
              className="flex h-12 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:min-w-64"
              onChange={(event) => setIssueInput(event.target.value)}
              value={issueInput}
            >
              <option value="">All issues</option>
              {availableIssues.map((availableIssue) => (
                <option key={availableIssue.slug} value={availableIssue.slug}>
                  {availableIssue.title}
                </option>
              ))}
            </select>
            <Button className="h-12" type="submit">
              <Search className="size-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Search results</CardTitle>
          <CardDescription>
            {publicationsState.data.length} publication
            {publicationsState.data.length === 1 ? '' : 's'} found
            {query ? ` for "${query}"` : ''}
            {issue ? ' in the selected issue' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {publicationsState.data.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {publicationsState.data.map((publication) => (
                <PublicationCard key={publication.slug} publication={publication} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-secondary/40 p-6 text-sm text-muted-foreground">
              No publications matched the current search. Try a broader keyword,
              remove the issue filter, or browse the{' '}
              <NavLink className="text-primary hover:underline" to="/research-repository">
                full repository
              </NavLink>
              .
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
