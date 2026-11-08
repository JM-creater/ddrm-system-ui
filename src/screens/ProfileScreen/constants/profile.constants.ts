import type { PasswordFormState } from '../types/profile.types'

export const EMPTY_PASSWORD_FORM: PasswordFormState = {
  currentPassword: '',
  newPassword: '',
  confirm: '',
}

export const MIN_PASSWORD_LENGTH = 8
