import type { Guide } from '../../../types'
import type { GuidePhaseField } from '../types/manageGuides.types'

export const EMPTY_GUIDE: Guide = {
  hazard: '',
  title: '',
  summary: '',
  beforeSteps: '',
  duringSteps: '',
  afterSteps: '',
  sortOrder: 0,
}

export const PHASES: readonly GuidePhaseField[] = [
  { key: 'beforeSteps', label: 'Before' },
  { key: 'duringSteps', label: 'During' },
  { key: 'afterSteps', label: 'After' },
]

export const sortGuides = (list: Guide[]) =>
  [...list].sort((a, b) => a.sortOrder - b.sortOrder || (a.id ?? 0) - (b.id ?? 0))
