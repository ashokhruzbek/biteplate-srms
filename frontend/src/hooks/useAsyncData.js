import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Sahifa-darajadagi ma'lumot yuklash uchun umumiy hook.
 * Loading / error / mounted boilerplate'ni markazlashtiradi.
 *
 * @param {() => Promise<any>} fetcher - ma'lumotni qaytaruvchi async funksiya
 * @param {{ initialData?: any, immediate?: boolean }} options
 */
export function useAsyncData(fetcher, options = {}) {
  const { initialData = null, immediate = true } = options

  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(immediate)
  const [error, setError] = useState('')

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await fetcherRef.current()
      setData(result)
      return result
    } catch (loadError) {
      setError(loadError.message)
      return undefined
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!immediate) {
      return undefined
    }

    let isActive = true

    setIsLoading(true)
    setError('')

    fetcherRef
      .current()
      .then((result) => {
        if (isActive) {
          setData(result)
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setError(loadError.message)
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [immediate])

  return { data, setData, isLoading, error, reload }
}
