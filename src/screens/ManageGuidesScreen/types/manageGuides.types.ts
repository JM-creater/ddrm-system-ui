import type { IncidentType } from '../../../types'

export interface GuidePhaseField {
  key: 'beforeSteps' | 'duringSteps' | 'afterSteps'
  label: string
}

export interface GuideSavePayload {
  hazard: IncidentType | ''
  title: string
  summary: string | null
  beforeSteps: string
  duringSteps: string
  afterSteps: string
  sortOrder: number
}
