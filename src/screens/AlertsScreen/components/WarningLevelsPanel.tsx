import { Panel } from '../../../components/ui/ui'
import { ALERT_LEVELS } from '../../../constants'

export default function WarningLevelsPanel() {
  return (
    <Panel title="Warning levels">
      {ALERT_LEVELS.map((l) => (
        <div key={l.value} className="d-flex gap-2 mb-2 align-items-start">
          <span className={`lvl-chip lvl-${l.value}`} aria-hidden />
          <div>
            <div className="fw-semibold">{l.label}</div>
            <div className="small text-muted">{l.meaning}</div>
          </div>
        </div>
      ))}
    </Panel>
  )
}
