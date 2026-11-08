import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthResponse, User } from '../types'

interface AuthState {
  token: string | null
  user: User | null
  expiresAt: number | null
  signIn: (res: AuthResponse) => void
  setUser: (user: User) => void
  signOut: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      expiresAt: null,
      signIn: (res) =>
        set({
          token: res.token,
          user: res.user,
          expiresAt: Date.now() + res.expiresIn * 1000,
        }),
      setUser: (user) => set({ user }),
      signOut: () => set({ token: null, user: null, expiresAt: null }),
    }),
    {
      name: 'tabunok-drrm-session',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.expiresAt && state.expiresAt < Date.now()) {
          state.signOut()
        }
      },
    },
  ),
)

export const homePathFor = (user: User | null) => (user?.role === 'ADMIN' ? '/admin' : '/dashboard')
