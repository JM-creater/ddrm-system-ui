import { api } from '../../../api/client'
import type { Guide } from '../../../types'
import type { GuideSavePayload } from '../types/manageGuides.types'

export async function fetchGuides(): Promise<Guide[]> {
  const res = await api.get<Guide[]>('/guides')
  return res.data
}

export async function deleteGuide(id: number | undefined): Promise<void> {
  await api.delete(`/admin/guides/${id}`)
}

export async function saveGuide(id: number | undefined, body: GuideSavePayload): Promise<Guide> {
  const res = id ? await api.put<Guide>(`/admin/guides/${id}`, body) : await api.post<Guide>('/admin/guides', body)
  return res.data
}
