import type { Incident } from '../../../types'

export interface ManageIncidentsToolbarProps {
  q: string
  status: string
  type: string
  purok: string
  puroks: string[]
  filtered: boolean
  onSearch: (v: string) => void
  onUpdate: (patch: Record<string, string>) => void
  onClear: () => void
}

export interface ManageIncidentsTableProps {
  items: Incident[]
  loading: boolean
  onSelect: (incident: Incident) => void
}
