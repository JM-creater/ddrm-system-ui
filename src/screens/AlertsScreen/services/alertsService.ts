import { api } from '../../../api/client'
import type { Alert } from '../../../types'

export async function fetchAlerts(): Promise<Alert[]> {
  const res = await api.get<Alert[]>('/alerts')
  return res.data
}
