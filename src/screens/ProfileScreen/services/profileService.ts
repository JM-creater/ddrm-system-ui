import { api } from '../../../api/client'
import type { PublicInfo, User } from '../../../types'
import type { ProfileFormState } from '../types/profile.types'

export async function fetchPublicPuroks(): Promise<string[]> {
  try {
    const res = await api.get<PublicInfo>('/public/info')
    return res.data.puroks
  } catch {
    return []
  }
}

export async function fetchMyProfile(): Promise<User> {
  const res = await api.get<User>('/profile')
  return res.data
}

export async function updateMyProfile(payload: ProfileFormState): Promise<User> {
  const res = await api.put<User>('/profile', payload)
  return res.data
}

export async function updateMyPassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
  await api.put('/profile/password', payload)
}
