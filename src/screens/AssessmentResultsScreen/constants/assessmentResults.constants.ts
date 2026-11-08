export const PART: Record<string, string> = {
  KNOWLEDGE: 'Part II',
  ATTITUDE: 'Part III',
  PRACTICE: 'Part IV',
}

export const DOMAIN_ORDER = ['KNOWLEDGE', 'ATTITUDE', 'PRACTICE']

export const SURVEY_EXPORT_FILENAME = 'kap-survey-responses.csv'

export const fmtStat = (v: number | null) => (v === null ? '—' : v.toFixed(3))
