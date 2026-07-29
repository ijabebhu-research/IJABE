import { useEffect, useState } from 'react'

const resourceCache = new WeakMap<() => Promise<unknown>, unknown>()

type ResourceState<T> = {
  data: T
  isLoading: boolean
  isFallback: boolean
}

export function usePublicResource<T>(
  loader: () => Promise<T>,
  fallback: T,
): ResourceState<T> {
  const getCachedData = () => resourceCache.get(loader) as T | undefined
  const [data, setData] = useState<T>(() => getCachedData() ?? fallback)
  const [isLoading, setIsLoading] = useState(() => getCachedData() === undefined)
  const [isFallback, setIsFallback] = useState(() => getCachedData() === undefined)

  useEffect(() => {
    let isMounted = true

    async function load() {
      setIsLoading(true)

      try {
        const result = await loader()
        if (!isMounted) {
          return
        }

        resourceCache.set(loader, result)
        setData(result)
        setIsFallback(false)
      } catch {
        if (!isMounted) {
          return
        }

        setData(fallback)
        setIsFallback(true)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [fallback, loader])

  return { data, isLoading, isFallback }
}
