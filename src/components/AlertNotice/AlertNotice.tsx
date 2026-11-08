import type { Alert } from '../../types'
import { fmtDateTime, fromNow } from '../../utils/format'
import './AlertNotice.css'

/** A warning shown as a coloured banner. `compact` shows only the headline. */
export default function AlertNotice({ alert, compact = false }: { alert: Alert; compact?: boolean }) {
  const lifted = !alert.active
  return (
    <article className={`warning tone-${alert.level} ${lifted ? 'lifted' : ''}`}>
      <div className="body">
        <div className="title">
          <span aria-hidden="true">🔔</span> {alert.title}
        </div>
        {!compact && (
          <>
            <div className="meta">
              {alert.hazardLabel ? `${alert.hazardLabel} · ` : ''}
              {alert.affectedArea ? `${alert.affectedArea} · ` : ''}
              Issued {fmtDateTime(alert.createdAt)} ({fromNow(alert.createdAt)})
              {alert.postedBy && ` · ${alert.postedBy}`}
              {lifted && alert.liftedAt && ` · lifted ${fmtDateTime(alert.liftedAt)}`}
            </div>
            <p className="msg">{alert.message}</p>
          </>
        )}
      </div>
      <span className="lvl">{lifted ? 'LIFTED' : alert.level}</span>
    </article>
  )
}
