import { useEffect, useState } from 'react'

type ResourceState<T> = {
  data: T
  isLoading: boolean
  isFallback: boolean
}

export function usePublicResource<T>(
  loader: () => Promise<T>,
  fallback: T,
): ResourceState<T> {
  const [data, setData] = useState<T>(fallback)
  const [isLoading, setIsLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function load() {
      setIsLoading(true)

      try {
        const result = await loader()
        if (!isMounted) {
          return
        }

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
