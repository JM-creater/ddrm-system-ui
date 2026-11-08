import { useLoad } from '../../../hooks'
import { fetchGuides } from '../services/guidesService'

export function useGuides() {
  return useLoad(fetchGuides)
}
