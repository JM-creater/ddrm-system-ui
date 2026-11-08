import { Button, Table } from 'react-bootstrap'
import { PageHeader, Panel } from '../../../components/ui/ui'
import type { QuizAttempt, QuizQuestion, QuizResult } from '../../../types'
import { fmtDateTime } from '../../../utils/format'
import { PASSING_PERCENT, QUIZ_TITLE } from '../constants/quiz.constants'

interface Props {
  questions: QuizQuestion[]
  history: QuizAttempt[]
  result: QuizResult
  onRetake: () => void
}

export default function QuizResultView({ questions, history, result, onRetake }: Props) {
  const optionText = (qid: number, key: string) =>
    questions.find((q) => q.id === qid)?.options.find((o) => o.value === key)?.label ?? key

  return (
    <>
      <PageHeader
        icon="📝"
        title={QUIZ_TITLE}
        subtitle={`Your result · ${fmtDateTime(result.takenAt)}`}
        actions={
          <Button variant="outline-primary" size="sm" onClick={onRetake}>
            ↻ Take it again
          </Button>
        }
      />
      <Panel className="mb-3">
        <div className="score-box">
          <div className="big tabular">
            {result.score}/{result.total}
          </div>
          <div>
            <div className="fs-5 fw-bold">
              {result.percent}% · {result.rating}
            </div>
            <div className="text-muted small">
              {result.percent >= PASSING_PERCENT
                ? 'You know the basics well. Read the guides for the items you missed.'
                : 'Go over the explanations below and the preparedness guides, then try again.'}
            </div>
          </div>
        </div>
      </Panel>
      <Panel title="Answer Review">
        {result.items.map((it, idx) => (
          <div className="quiz-q" key={it.questionId}>
            <div className="q">
              <span>
                {idx + 1}. {it.question}
              </span>
              <span className={`ms-auto mark ${it.correctAnswer ? 'ok' : 'no'}`}>{it.correctAnswer ? '✔ Correct' : '✖ Wrong'}</span>
            </div>
            <div className="quiz-opts">
              {!it.correctAnswer && (
                <div className="quiz-opt static wrong">
                  <span className="key">{it.selected})</span>
                  <span>
                    {optionText(it.questionId, it.selected)} <span className="text-muted small">(your answer)</span>
                  </span>
                </div>
              )}
              <div className="quiz-opt static right">
                <span className="key">{it.correct})</span>
                <span>
                  {it.correctText}
                  {it.correctAnswer && <span className="text-muted small"> (your answer)</span>}
                </span>
              </div>
            </div>
            {it.explanation && <div className="explain">💡 {it.explanation}</div>}
          </div>
        ))}
      </Panel>
      <Panel title="My Recent Scores" bodyClass="" className="mt-3">
        <Table size="sm" className="stat-table mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th className="num">Score</th>
              <th className="num">%</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td>{fmtDateTime(h.takenAt)}</td>
                <td className="num">
                  {h.score}/{h.total}
                </td>
                <td className="num">{h.percent}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    </>
  )
}
