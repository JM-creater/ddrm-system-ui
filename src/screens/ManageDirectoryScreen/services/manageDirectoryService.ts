import { api } from '../../../api/client'
import type { EvacuationCenter, Hotline } from '../../../types'
import type { ManageDirectoryData } from '../types/manageDirectory.types'

export async function fetchManageDirectoryData(): Promise<ManageDirectoryData> {
  const [c, h] = await Promise.all([
    api.get<EvacuationCenter[]>('/directory/centers'),
    api.get<Hotline[]>('/directory/hotlines'),
  ])
  return { centers: c.data, hotlines: h.data }
}

export async function updateCenterOpenStatus(c: EvacuationCenter): Promise<EvacuationCenter> {
  const res = await api.put<EvacuationCenter>(`/admin/directory/centers/${c.id}`, { ...c, open: !c.open })
  return res.data
}

export async function deleteCenterById(id: number | undefined): Promise<void> {
  await api.delete(`/admin/directory/centers/${id}`)
}

export async function deleteHotlineById(id: number | undefined): Promise<void> {
  await api.delete(`/admin/directory/hotlines/${id}`)
}

export async function saveDirectoryResource<T>(path: string, id: number | undefined, body: unknown): Promise<T> {
  const res = id ? await api.put<T>(`${path}/${id}`, body) : await api.post<T>(path, body)
  return res.data
}
