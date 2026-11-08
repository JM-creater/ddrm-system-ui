import type { MySurvey, SurveyForm, SurveySection } from '../../../types'

export interface LoadedAssessment {
  form: SurveyForm
  mine: MySurvey
}

export interface SurveyPart {
  section: SurveySection
  part: string
}

export interface ProfileFieldConfig {
  key: string
  label: string
}

export interface SurveySubmitPayload {
  ageGroup: string
  sex: string
  education: string
  householdSize: string
  residency: string
  income: string
  experiencedDisaster: boolean
  answers: Record<number, number>
}
