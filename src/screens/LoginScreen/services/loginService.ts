import { api } from '../../../api/client'
import type { AuthResponse, PublicInfo } from '../../../types'
import type { LoginCredentials, RegisterPayload } from '../types/login.types'

export async function fetchPublicPuroks(): Promise<string[]> {
  try {
    const res = await api.get<PublicInfo>('/public/info')
    return res.data.puroks
  } catch {
    return []
  }
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', credentials)
  return res.data
}

export async function registerResident(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', payload)
  return res.data
}
