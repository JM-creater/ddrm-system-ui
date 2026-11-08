import { api, download } from '../../../api/client'
import type { Incident, PageResponse } from '../../../types'

export async function fetchIncidents(params: Record<string, unknown>): Promise<PageResponse<Incident>> {
  const res = await api.get<PageResponse<Incident>>('/incidents', { params })
  return res.data
}

export async function exportIncidentsCsv(filters: Record<string, unknown>, filename: string) {
  await download('/incidents/export', filters, filename)
}
