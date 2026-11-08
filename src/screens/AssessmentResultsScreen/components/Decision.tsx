import type { DecisionProps } from '../types/assessmentResults.types'

export default function Decision({ text, note }: DecisionProps) {
  if (!text) return <span className="text-muted small">{note ?? 'Not enough data'}</span>
  const rejected = /^reject/i.test(text)
  return (
    <span>
      <span className={rejected ? 'reject' : 'accept'}>{text}</span>
      {note && <div className="small text-muted">{note}</div>}
    </span>
  )
}
