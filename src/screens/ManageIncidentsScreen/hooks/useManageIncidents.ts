import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { cleanParams, errorMessage } from '../../../api/client'
import { useLoad } from '../../../hooks'
import type { Incident } from '../../../types'
import { EXPORT_FILENAME, PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '../constants/manageIncidents.constants'
import { exportAdminIncidentsCsv, fetchAdminIncidents, fetchPublicPuroks } from '../services/manageIncidentsService'

export function useManageIncidents() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') ?? ''
  const status = params.get('status') ?? ''
  const purok = params.get('purok') ?? ''
  const qParam = params.get('q') ?? ''
  const page = Math.max(0, Number(params.get('page') ?? 0) || 0)
  const [q, setQ] = useState(qParam)
  const searchTimer = useRef<number | undefined>(undefined)
  const [puroks, setPuroks] = useState<string[]>([])
  const [open, setOpen] = useState<Incident | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    void fetchPublicPuroks().then(setPuroks)
  }, [])

  useEffect(() => () => window.clearTimeout(searchTimer.current), [])

  const update = (patch: Record<string, string>, resetPage = true) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [k, v] of Object.entries(patch)) {
          if (v) next.set(k, v)
          else next.delete(k)
        }
        if (resetPage) next.delete('page')
        return next
      },
      { replace: true },
    )
  }

  const onSearch = (value: string) => {
    setQ(value)
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => update({ q: value.trim() }), SEARCH_DEBOUNCE_MS)
  }

  const clearFilters = () => {
    window.clearTimeout(searchTimer.current)
    setQ('')
    setParams(new URLSearchParams(), { replace: true })
  }

  const filters = cleanParams({ type, status, purok, q: qParam })

  const { data, loading, error, reload, setData } = useLoad(
    () => fetchAdminIncidents({ ...filters, page, size: PAGE_SIZE }),
    [type, status, purok, qParam, page],
  )

  const exportCsv = async () => {
    setExporting(true)
    try {
      await exportAdminIncidentsCsv(filters, EXPORT_FILENAME)
    } catch (err) {
      toast.error(errorMessage(err, 'Export failed.'))
    } finally {
      setExporting(false)
    }
  }

  const onChanged = (updated: Incident | null, id: number) => {
    setOpen(null)
    if (updated && (!status || updated.status === status)) {
      setData((d) => (d ? { ...d, content: d.content.map((i) => (i.id === id ? updated : i)) } : d))
    } else {
      reload()
    }
  }

  const filtered = Boolean(type || status || purok || qParam)

  return {
    type,
    status,
    purok,
    puroks,
    q,
    open,
    setOpen,
    exporting,
    data,
    loading,
    error,
    reload,
    update,
    onSearch,
    clearFilters,
    exportCsv,
    onChanged,
    filtered,
  }
}
