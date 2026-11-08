import { api } from '../../../api/client'
import type { AdminDashboard } from '../../../types'

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  const res = await api.get<AdminDashboard>('/admin/dashboard')
  return res.data
}
