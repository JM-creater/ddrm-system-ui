import type { AdminDashboard, Incident } from '../../../types'

export interface AdminStatsRowProps {
  data: AdminDashboard
}

export interface PendingQueuePanelProps {
  pendingQueue: Incident[]
  onSelect: (incident: Incident) => void
}

export interface CommunityReadinessPanelProps {
  data: AdminDashboard
}
