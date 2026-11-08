import { useState } from 'react'
import { useLoad } from '../../../hooks'
import { fetchAlerts } from '../services/alertsService'
import type { AlertFilterView } from '../types/alerts.types'

export function useAlerts() {
  const { data, loading, error, reload } = useLoad(fetchAlerts)
  const [view, setView] = useState<AlertFilterView>('active')
  const list = (data ?? []).filter((a) => view === 'all' || a.active)

  return { data, loading, error, reload, view, setView, list }
}
