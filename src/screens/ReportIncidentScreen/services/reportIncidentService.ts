import { api } from '../../../api/client'
import type { Incident, PublicInfo } from '../../../types'

export async function fetchPublicPuroks(): Promise<string[]> {
  try {
    const res = await api.get<PublicInfo>('/public/info')
    return res.data.puroks
  } catch {
    return []
  }
}

export async function submitIncidentReport(
  formData: FormData,
  onProgress: (percent: number) => void,
): Promise<Incident> {
  const res = await api.post<Incident>('/incidents', formData, {
    timeout: 0,
    onUploadProgress: (e) => {
      if (e.total) onProgress(Math.round((e.loaded / e.total) * 100))
    },
  })
  return res.data
}
