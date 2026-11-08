import { api } from '../../../api/client'
import type { Guide } from '../../../types'

export async function fetchGuides(): Promise<Guide[]> {
  const res = await api.get<Guide[]>('/guides')
  return res.data
}
