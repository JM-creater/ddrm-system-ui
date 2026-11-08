import { Link } from 'react-router-dom'
import { Gauge } from '../../../components/Charts/Charts'
import { Panel } from '../../../components/ui/ui'
import { READINESS_FAIR_THRESHOLD, READINESS_GOOD_THRESHOLD } from '../constants/dashboard.constants'
import type { PreparednessPanelProps } from '../types/dashboard.types'

export default function PreparednessPanel({ data, readiness, word }: PreparednessPanelProps) {
  const pillTone = readiness >= READINESS_GOOD_THRESHOLD ? 'good' : readiness >= READINESS_FAIR_THRESHOLD ? 'fair' : 'poor'
  return (
    <Panel title="🎯 My Preparedness Level" className="h-100">
      <div className="donut-box">
        <Gauge percent={readiness} />
        {data.readiness ? (
          <>
            <span className={`level-pill ${pillTone}`}>{word}</span>
            <div className="small text-muted">
              KAP survey: {data.readiness.level} (mean {data.readiness.mean.toFixed(2)} of 4) ·{' '}
              <Link to="/assessment">See details</Link>
            </div>
          </>
        ) : (
          <>
            <span className="level-pill poor">Needs Improvement</span>
            <div className="small text-muted">
              <Link to="/assessment">Answer the preparedness survey</Link> to see your level.
            </div>
          </>
        )}
      </div>
    </Panel>
  )
}
