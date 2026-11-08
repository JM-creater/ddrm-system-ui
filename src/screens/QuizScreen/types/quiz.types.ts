import type { QuizAttempt, QuizQuestion } from '../../../types'

export interface LoadedQuizData {
  questions: QuizQuestion[]
  history: QuizAttempt[]
}
