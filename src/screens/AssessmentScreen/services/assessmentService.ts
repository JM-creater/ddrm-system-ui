import { api } from '../../../api/client'
import type { MySurvey, SurveyForm } from '../../../types'
import type { LoadedAssessment, SurveySubmitPayload } from '../types/assessment.types'

export async function fetchAssessmentData(): Promise<LoadedAssessment> {
  const [f, m] = await Promise.all([
    api.get<SurveyForm>('/survey/form'),
    api.get<MySurvey>('/survey/me'),
  ])
  return { form: f.data, mine: m.data }
}

export async function submitSurveyAnswers(payload: SurveySubmitPayload): Promise<MySurvey> {
  const res = await api.post<MySurvey>('/survey', payload)
  return res.data
}
