import { api } from '../../../api/client'
import type { PageResponse, User } from '../../../types'
import type { ResidentsQueryParams } from '../types/residents.types'

export async function fetchResidents(params: ResidentsQueryParams): Promise<PageResponse<User>> {
  const res = await api.get<PageResponse<User>>('/admin/users', { params })
  return res.data
}

export async function updateResidentStatus(id: number, enabled: boolean): Promise<User> {
  const res = await api.patch<User>(`/admin/users/${id}/status`, { enabled })
  return res.data
}
