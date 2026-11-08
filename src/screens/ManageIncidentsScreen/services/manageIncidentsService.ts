import { api, download } from '../../../api/client'
import type { Incident, PageResponse, PublicInfo } from '../../../types'

export async function fetchPublicPuroks(): Promise<string[]> {
  try {
    const res = await api.get<PublicInfo>('/public/info')
    return res.data.puroks
  } catch {
    return []
  }
}

export async function fetchAdminIncidents(params: Record<string, unknown>): Promise<PageResponse<Incident>> {
  const res = await api.get<PageResponse<Incident>>('/incidents', { params })
  return res.data
}

export async function exportAdminIncidentsCsv(filters: Record<string, unknown>, filename: string) {
  await download('/incidents/export', filters, filename)
}
