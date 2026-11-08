import { api, download } from '../../../api/client'
import type { SurveyAnalytics } from '../../../types'
import { SURVEY_EXPORT_FILENAME } from '../constants/assessmentResults.constants'

export async function fetchSurveyAnalytics(): Promise<SurveyAnalytics> {
  const res = await api.get<SurveyAnalytics>('/admin/survey/analytics')
  return res.data
}

export async function exportSurveyResponsesCsv(): Promise<void> {
  await download('/admin/survey/export', {}, SURVEY_EXPORT_FILENAME)
}
