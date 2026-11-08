import { useState } from 'react'
import { useLoad } from '../../../hooks'
import { fetchAssessmentData } from '../services/assessmentService'
import type { LoadedAssessment } from '../types/assessment.types'

export function useAssessment() {
  const { data, loading, error, reload, setData } = useLoad<LoadedAssessment>(fetchAssessmentData)
  const [editing, setEditing] = useState(false)

  return { data, loading, error, reload, setData, editing, setEditing }
}
