import type { GuidePhase } from '../types/guides.types'

export const PHASES: readonly GuidePhase[] = [
  { key: 'beforeSteps', cls: 'before', title: 'Before' },
  { key: 'duringSteps', cls: 'during', title: 'During' },
  { key: 'afterSteps', cls: 'after', title: 'After' },
]

export const GUIDES_TITLE = 'Disaster Preparedness Guides'
export const GUIDES_SUBTITLE = 'Hazards relevant to Tabunok — coastal, riverine and slope'
