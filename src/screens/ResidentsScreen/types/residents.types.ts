import type { User } from '../../../types'

export interface ResidentsQueryParams {
  q?: string
  page: number
  size: number
}

export interface ResidentsTableProps {
  residents: User[]
  loading: boolean
  busyId: number | null
  onToggle: (u: User) => void
}
