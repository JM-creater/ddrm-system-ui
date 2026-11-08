import type { Incident, ResidentDashboard } from '../../../types'

export interface DashboardStatsProps {
  data: ResidentDashboard
}

export interface PreparednessPanelProps {
  data: ResidentDashboard
  readiness: number
  word: string
}

export interface RecentReportsPanelProps {
  reports: Incident[]
  totalCount: number
  onSelect: (incident: Incident) => void
}
