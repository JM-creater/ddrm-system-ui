import { homePathFor } from '../../../store/auth'
import type { User } from '../../../types'
import type { NotFoundDestination } from '../types/notFound.types'

export function resolveNotFoundDestination(user: User | null): NotFoundDestination {
  return {
    to: user ? homePathFor(user) : '/login',
    label: user ? 'Back to my dashboard' : 'Go to sign in',
  }
}
