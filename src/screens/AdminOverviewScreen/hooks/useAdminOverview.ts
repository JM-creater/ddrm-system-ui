import { useState } from 'react'
import { useLoad } from '../../../hooks'
import type { Incident } from '../../../types'
import { fetchAdminDashboard } from '../services/adminOverviewService'

export function useAdminOverview() {
  const { data, loading, error, reload } = useLoad(fetchAdminDashboard)
  const [open, setOpen] = useState<Incident | null>(null)

  return { data, loading, error, reload, open, setOpen }
}
