export type AuthTab = 'login' | 'register'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterValues {
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  purok: string
  address: string
  password: string
  confirm: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  purok: string
  address: string | null
  password: string
}

export interface PasswordInputProps {
  id: string
  value: string
  onChange: (v: string) => void
  invalid?: boolean
  autoComplete: string
  placeholder?: string
}
