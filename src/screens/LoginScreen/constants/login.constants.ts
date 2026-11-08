import type { RegisterValues } from '../types/login.types'

export const EMPTY_REGISTER_VALUES: RegisterValues = {
  firstName: '',
  lastName: '',
  email: '',
  contactNumber: '',
  purok: '',
  address: '',
  password: '',
  confirm: '',
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 72
