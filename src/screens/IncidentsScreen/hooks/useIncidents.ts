import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { cleanParams, errorMessage } from '../../../api/client'
import { useLoad } from '../../../hooks'
import type { Incident } from '../../../types'
import { DEFAULT_EXPORT_FILENAME, SEARCH_DEBOUNCE_MS } from '../constants/incidents.constants'
import { exportIncidentsCsv, fetchIncidents } from '../services/incidentsService'

export function useIncidents() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') ?? ''
  const status = params.get('status') ?? ''
  const mine = params.get('mine') === '1'
  const page = Math.max(0, Number(params.get('page') ?? 0) || 0)
  const qParam = params.get('q') ?? ''
  const [q, setQ] = useState(qParam)
  const searchTimer = useRef<number | undefined>(undefined)
  const [open, setOpen] = useState<Incident | null>(null)
  const [exporting, setExporting] = useState(false)

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

  const filters = cleanParams({ type, status, mine, q: qParam })

  const { data, loading, error, reload, setData } = useLoad(
    () => fetchIncidents({ ...filters, page }),
    [type, status, mine, qParam, page],
  )

  const exportCsv = async () => {
    setExporting(true)
    try {
      await exportIncidentsCsv(filters, DEFAULT_EXPORT_FILENAME)
    } catch (err) {
      toast.error(errorMessage(err, 'Export failed.'))
    } finally {
      setExporting(false)
    }
  }

  const onChanged = (updated: Incident | null, id: number) => {
    setOpen(null)
    if (updated) {
      setData((d) => (d ? { ...d, content: d.content.map((i) => (i.id === id ? updated : i)) } : d))
    } else {
      reload()
    }
  }

  const filtered = Boolean(type || status || mine || params.get('q'))

  return {
    type,
    status,
    mine,
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
