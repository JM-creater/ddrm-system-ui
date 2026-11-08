import { Link } from 'react-router-dom'
import { Panel } from '../../../components/ui/ui'
import type { QuizAttempt, QuizQuestion } from '../../../types'
import { fmtDateTime } from '../../../utils/format'

interface Props {
  questions: QuizQuestion[]
  lastAttempt?: QuizAttempt
  answers: Record<number, string>
  onSelect: (questionId: number, value: string) => void
}

export default function QuizQuestionList({ questions, lastAttempt, answers, onSelect }: Props) {
  return (
    <Panel>
      <p className="quiz-intro">
        Choose one answer per item, then submit. Your score updates the dashboard gauge.
        {lastAttempt && (
          <>
            {' '}
            Last score:{' '}
            <b>
              {lastAttempt.score}/{lastAttempt.total} ({lastAttempt.percent}%)
            </b>{' '}
            on {fmtDateTime(lastAttempt.takenAt)}.
          </>
        )}{' '}
        Not sure yet? Read the <Link to="/guides">preparedness guides</Link> first.
      </p>
      {questions.map((q, idx) => (
        <div className="quiz-q" key={q.id} id={`qq-${q.id}`}>
          <div className="q">
            {idx + 1}. {q.question}
          </div>
          <div className="quiz-opts" role="radiogroup" aria-label={`Question ${idx + 1}`}>
            {q.options.map((o) => (
              <label key={o.value} className={`quiz-opt ${answers[q.id] === o.value ? 'on' : ''}`}>
                <input
                  type="radio"
                  name={`qq-${q.id}`}
                  value={o.value}
                  checked={answers[q.id] === o.value}
                  onChange={() => onSelect(q.id, o.value)}
                />
                <span className="key">{o.value})</span>
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </Panel>
  )
}
