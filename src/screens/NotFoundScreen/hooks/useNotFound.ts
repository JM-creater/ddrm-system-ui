import { useAuth } from '../../../store/auth'
import { resolveNotFoundDestination } from '../services/notFoundService'

export function useNotFound() {
  const user = useAuth((s) => s.user)
  return resolveNotFoundDestination(user)
}
