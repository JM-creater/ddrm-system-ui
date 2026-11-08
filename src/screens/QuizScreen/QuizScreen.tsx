import { Button, Spinner } from 'react-bootstrap'
import { EmptyState, ErrorState, Loading, PageHeader } from '../../components/ui/ui'
import QuizQuestionList from './components/QuizQuestionList'
import QuizResultView from './components/QuizResultView'
import { QUIZ_TITLE } from './constants/quiz.constants'
import './css/QuizScreen.css'
import { useQuiz } from './hooks/useQuiz'

export default function QuizScreen() {
  const {
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
  } = useQuiz()

  if (loading && !data) return <Loading />
  if (error || !data) return <ErrorState message={error ?? 'No data.'} onRetry={reload} />

  const { questions, history } = data
  const answered = questions.filter((q) => answers[q.id]).length
  const last = history[0]

  if (questions.length === 0) {
    return (
      <>
        <PageHeader icon="📝" title={QUIZ_TITLE} />
        <EmptyState title="No questions available yet">The DRRM office has not published the test questions.</EmptyState>
      </>
    )
  }

  if (result) {
    return <QuizResultView questions={questions} history={history} result={result} onRetake={retake} />
  }

  return (
    <>
      <PageHeader
        icon="📝"
        title={QUIZ_TITLE}
        subtitle={`${questions.length} items · measures preparedness knowledge of Tabunok residents`}
      />
      <QuizQuestionList
        questions={questions}
        lastAttempt={last}
        answers={answers}
        onSelect={(qid, val) => setAnswers((a) => ({ ...a, [qid]: val }))}
      />
      <div className="sticky-bar">
        <div className="d-flex align-items-center gap-3">
          <div className="flex-grow-1">
            <div className="small text-muted mb-1">
              {answered} of {questions.length} answered
            </div>
            <div className="progress-line">
              <span style={{ width: `${(answered / questions.length) * 100}%` }} />
            </div>
          </div>
          {answered > 0 && (
            <Button variant="outline-primary" onClick={clearAnswers} disabled={saving}>
              Clear
            </Button>
          )}
          <Button variant="primary" onClick={submit} disabled={saving}>
            {saving && <Spinner size="sm" className="me-2" />}
            Submit Answers
          </Button>
        </div>
      </div>
    </>
  )
}
