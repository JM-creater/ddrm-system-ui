import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { SetStateAction } from 'react'
import { errorMessage } from '../api/client'

interface LoadState<T> {
  key: string | null
  data: T | null
  error: string | null
}

/**
 * Runs `loader` whenever `deps` change (or `reload()` is called).
 * Responses that arrive after a newer request has started are ignored.
 * Data from the previous request stays visible while the next one loads.
 */
export function useLoad<T>(loader: () => Promise<T>, deps: readonly unknown[] = []) {
  const loaderRef = useRef(loader)
  useLayoutEffect(() => {
    loaderRef.current = loader
  })

  const [nonce, setNonce] = useState(0)
  const key = `${JSON.stringify(deps)}#${nonce}`
  const [state, setState] = useState<LoadState<T>>({ key: null, data: null, error: null })

  useEffect(() => {
    let current = true
    loaderRef.current().then(
      (data) => {
        if (current) setState({ key, data, error: null })
      },
      (err: unknown) => {
        if (current) setState((s) => ({ key, data: s.data, error: errorMessage(err) }))
      },
    )
    return () => {
      current = false
    }
  }, [key])

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  const setData = useCallback((update: SetStateAction<T | null>) => {
    setState((s) => ({
      ...s,
      data: typeof update === 'function' ? (update as (prev: T | null) => T | null)(s.data) : update,
    }))
  }, [])

  const loading = state.key !== key
  return { data: state.data, loading, error: loading ? null : state.error, reload, setData }
}

export function useDebounced<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
