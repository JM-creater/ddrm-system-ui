import type { ProfileFieldConfig, SurveyPart } from '../types/assessment.types'

export const PARTS: SurveyPart[] = [
  { section: 'KNOWLEDGE', part: 'Part II' },
  { section: 'ATTITUDE', part: 'Part III' },
  { section: 'PRACTICE', part: 'Part IV' },
]

export const PROFILE_FIELDS: ProfileFieldConfig[] = [
  { key: 'ageGroup', label: 'Age' },
  { key: 'sex', label: 'Sex' },
  { key: 'education', label: 'Highest educational attainment' },
  { key: 'householdSize', label: 'Number of household members' },
  { key: 'residency', label: 'Length of residency in Tabunok' },
  { key: 'income', label: 'Monthly household income' },
  { key: 'experiencedDisaster', label: 'Have you experienced a disaster before?' },
]

export const INTERPRETATION: [string, string][] = [
  ['3.26 – 4.00', 'Very High'],
  ['2.51 – 3.25', 'High'],
  ['1.76 – 2.50', 'Low'],
  ['1.00 – 1.75', 'Very Low'],
]
