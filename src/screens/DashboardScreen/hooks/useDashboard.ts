import { useState } from 'react'
import { useLoad } from '../../../hooks'
import { useAuth } from '../../../store/auth'
import type { Incident } from '../../../types'
import { fetchResidentDashboard } from '../services/dashboardService'

export function useDashboard() {
  const user = useAuth((s) => s.user)
  const { data, loading, error, reload } = useLoad(fetchResidentDashboard)
  const [open, setOpen] = useState<Incident | null>(null)

  return { user, data, loading, error, reload, open, setOpen }
}
