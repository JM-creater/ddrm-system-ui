import { useState } from 'react'
import { toast } from 'react-toastify'
import { errorMessage } from '../../../api/client'
import { useLoad } from '../../../hooks'
import { exportSurveyResponsesCsv, fetchSurveyAnalytics } from '../services/assessmentResultsService'

export function useAssessmentResults() {
  const { data, loading, error, reload } = useLoad(fetchSurveyAnalytics)
  const [exporting, setExporting] = useState(false)

  const exportCsv = async () => {
    setExporting(true)
    try {
      await exportSurveyResponsesCsv()
    } catch (err) {
      toast.error(errorMessage(err, 'Export failed.'))
    } finally {
      setExporting(false)
    }
  }

  return { data, loading, error, reload, exporting, exportCsv }
}
