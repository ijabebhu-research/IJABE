import { Info } from 'lucide-react'

type DataStatusProps = {
  isLoading?: boolean
  isFallback?: boolean
}

export function DataStatus({ isLoading, isFallback }: DataStatusProps) {
  if (!isLoading && !isFallback) {
    return null
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
      <Info className="size-4 text-primary" />
      <span>
        {isLoading
          ? 'Loading live public content.'
          : 'Showing saved example content while the website connection is unavailable.'}
      </span>
    </div>
  )
}
