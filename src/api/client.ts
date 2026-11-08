import axios from 'axios'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../store/auth'
import type { ApiErrorBody } from '../types'

export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 60000,
})

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const isAuthCall = url.startsWith('/auth/login') || url.startsWith('/auth/register')
    if (status === 401 && !isAuthCall && useAuth.getState().token) {
      useAuth.getState().signOut()
      toast.info('Your session has ended. Please sign in again.', { toastId: 'session-ended' })
    }
    return Promise.reject(error)
  },
)

/** Best human-readable message for a failed request. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot reach the server. Check your connection or try again in a while.'
    }
    const body = error.response.data as ApiErrorBody | Blob | undefined
    if (body && !(body instanceof Blob) && typeof body.message === 'string' && body.message) {
      return body.message
    }
    if (error.response.status === 413) return 'The files are too large to upload.'
  }
  return fallback
}

/** Field level validation messages returned by the API, keyed by field name. */
export function fieldErrors(error: unknown): Record<string, string> {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body && typeof body === 'object' && body.errors) return body.errors
  }
  return {}
}

/** Uploaded files are served by the API at /uploads/... */
export function fileUrl(path: string): string {
  return path.startsWith('http') ? path : `${API_URL}${path}`
}

/** Downloads a file (e.g. CSV export) using the current session token. */
export async function download(path: string, params: Record<string, unknown>, fallbackName: string) {
  const res = await api.get<Blob>(path, { params, responseType: 'blob' })
  const disposition = String(res.headers['content-disposition'] ?? '')
  const match = /filename="?([^";]+)"?/i.exec(disposition)
  const name = match?.[1] ?? fallbackName
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Removes empty values so they are not sent as query parameters. */
export function cleanParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  const out: Partial<T> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== '' && v !== null && v !== undefined && v !== false) {
      out[k as keyof T] = v as T[keyof T]
    }
  }
  return out
}
