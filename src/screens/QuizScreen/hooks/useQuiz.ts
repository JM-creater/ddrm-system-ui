import { useState } from 'react'
import { toast } from 'react-toastify'
import { errorMessage } from '../../../api/client'
import { useLoad } from '../../../hooks'
import type { QuizAttempt, QuizResult } from '../../../types'
import { confirmAction } from '../../../utils/dialogs'
import { MAX_RECENT_HISTORY } from '../constants/quiz.constants'
import { fetchQuizData, submitQuizAnswers } from '../services/quizService'

export function useQuiz() {
  const { data, loading, error, reload, setData } = useLoad(fetchQuizData)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [saving, setSaving] = useState(false)

  const retake = () => {
    setAnswers({})
    setResult(null)
    window.scrollTo({ top: 0 })
  }

  const clearAnswers = async () => {
    const ok = await confirmAction({
      title: 'Clear your answers?',
      text: 'All choices on this page will be removed.',
      confirmText: 'Clear',
    })
    if (ok) setAnswers({})
  }

  const submit = async () => {
    if (!data) return
    const { questions, history } = data
    const missing = questions.findIndex((q) => !answers[q.id])
    if (missing >= 0) {
      document.getElementById(`qq-${questions[missing].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast.error(`Question ${missing + 1} has no answer yet.`)
      return
    }
    setSaving(true)
    try {
      const res = await submitQuizAnswers(answers)
      setResult(res)
      const attempt: QuizAttempt = {
        id: res.attemptId,
        score: res.score,
        total: res.total,
        percent: res.percent,
        takenAt: res.takenAt,
      }
      setData({ questions, history: [attempt, ...history].slice(0, MAX_RECENT_HISTORY) })
      toast.success(`✅ Score saved: ${res.score}/${res.total}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return {
    data,
    loading,
    error,
    reload,
    answers,
    setAnswers,
    result,
    saving,
    retake,
    clearAnswers,
    submit,
  }
}
