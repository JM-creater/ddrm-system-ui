import type { Alert, AlertLevel, IncidentType } from '../../../types'

export type EditingAlertState = Alert | 'new' | null

export interface AlertSavePayload {
  title: string
  message: string
  level: AlertLevel | ''
  hazard: IncidentType | null
  affectedArea: string | null
}
