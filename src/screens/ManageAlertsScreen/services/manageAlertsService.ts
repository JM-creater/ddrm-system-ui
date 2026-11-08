import { api } from '../../../api/client'
import type { Alert } from '../../../types'
import type { AlertSavePayload } from '../types/manageAlerts.types'

export async function fetchAlerts(): Promise<Alert[]> {
  const res = await api.get<Alert[]>('/alerts')
  return res.data
}

export async function toggleAlertActive(id: number, active: boolean): Promise<Alert> {
  const res = await api.patch<Alert>(`/admin/alerts/${id}/active`, null, { params: { active } })
  return res.data
}

export async function deleteAlert(id: number): Promise<void> {
  await api.delete(`/admin/alerts/${id}`)
}

export async function saveAlert(id: number | undefined, body: AlertSavePayload): Promise<Alert> {
  const res = id ? await api.put<Alert>(`/admin/alerts/${id}`, body) : await api.post<Alert>('/admin/alerts', body)
  return res.data
}
