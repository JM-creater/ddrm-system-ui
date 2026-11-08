import { api } from '../../../api/client'
import type { ResidentDashboard } from '../../../types'

export async function fetchResidentDashboard(): Promise<ResidentDashboard> {
  const res = await api.get<ResidentDashboard>('/dashboard')
  return res.data
}
