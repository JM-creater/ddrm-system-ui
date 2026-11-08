import type { DifferenceResult, DomainResult } from '../../../types'

export interface DecisionProps {
  text: string | null
  note: string | null
}

export interface GroupMeansProps {
  groups: DifferenceResult['groups']
}

export interface ItemAnalysisAccordionProps {
  domains: DomainResult[]
}
