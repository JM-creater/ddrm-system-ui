import { api } from '../../../api/client'
import type { EvacuationCenter, Hotline } from '../../../types'
import type { DirectoryData } from '../types/directory.types'

export async function fetchDirectoryData(): Promise<DirectoryData> {
  const [c, h] = await Promise.all([
    api.get<EvacuationCenter[]>('/directory/centers'),
    api.get<Hotline[]>('/directory/hotlines'),
  ])
  return { centers: c.data, hotlines: h.data }
}
