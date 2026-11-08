import { api } from '../../../api/client'
import type { QuizAttempt, QuizQuestion, QuizResult } from '../../../types'
import type { LoadedQuizData } from '../types/quiz.types'

export async function fetchQuizData(): Promise<LoadedQuizData> {
  const [q, h] = await Promise.all([
    api.get<QuizQuestion[]>('/quiz/questions'),
    api.get<QuizAttempt[]>('/quiz/history'),
  ])
  return { questions: q.data, history: h.data }
}

export async function submitQuizAnswers(answers: Record<number, string>): Promise<QuizResult> {
  const res = await api.post<QuizResult>('/quiz/submit', { answers })
  return res.data
}
