import { Gauge } from '../../../components/Charts/Charts'
import { EmptyState, LevelText, Panel } from '../../../components/ui/ui'
import type { CommunityReadinessPanelProps } from '../types/adminOverview.types'

export default function CommunityReadinessPanel({ data }: CommunityReadinessPanelProps) {
  return (
    <Panel title="Community readiness" className="h-100">
      {data.averageReadiness ? (
        <div className="gauge">
          <Gauge percent={data.averageReadiness.percent} caption="average" />
          <div>
            <div className="text-muted small">Overall weighted mean</div>
            <div className="fs-3 fw-bold tabular">{data.averageReadiness.mean.toFixed(2)}</div>
            <div>
              <LevelText level={data.averageReadiness.level} /> preparedness
            </div>
            <div className="small text-muted">
              Based on {data.respondents} respondent{data.respondents === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState title="No KAP responses yet">Residents can answer the assessment from their portal.</EmptyState>
      )}
    </Panel>
  )
}
