import { Play } from 'lucide-react'
import { fileUrl } from '../../api/client'
import { TYPE_COLORS } from '../../constants'
import type { Incident } from '../../types'
import { fmtStamp } from '../../utils/format'
import './IncidentCard.css'

export default function IncidentCard({ incident, onOpen }: { incident: Incident; onOpen: (i: Incident) => void }) {
  const photos = incident.media.filter((m) => m.kind === 'PHOTO')
  const video = incident.media.find((m) => m.kind === 'VIDEO')
  const cover = photos[0]
  const place = incident.exactLocation ? `${incident.purok} - ${incident.exactLocation}` : incident.purok

  return (
    <button type="button" className="report-card" onClick={() => onOpen(incident)}>
      <div className="thumb" style={cover ? undefined : { background: TYPE_COLORS[incident.type] ?? TYPE_COLORS.OTHER }}>
        {cover ? (
          <img src={fileUrl(cover.url)} alt="" loading="lazy" />
        ) : (
          <span className="nomedia">{incident.typeLabel}</span>
        )}
      </div>
      <div className="info">
        <div className="pills">
          <span className={`tag st-${incident.status}`}>{incident.statusLabel.toLowerCase()}</span>
          <span className={`sev sev-${incident.severity}`}>{incident.severityLabel}</span>
          <span className="tag tag-plain">{incident.typeLabel.toLowerCase()}</span>
        </div>
        <div className="place">{place}</div>
        <p className="desc">{incident.description}</p>
        {(photos.length > 1 || video) && (
          <div className="mini">
            {photos.slice(1).map((p) => (
              <img key={p.id} src={fileUrl(p.url)} alt="" loading="lazy" />
            ))}
            {video && (
              <span className="vid" title="Has a video">
                <Play size={14} />
              </span>
            )}
          </div>
        )}
      </div>
      <div className="meta">
        <span>
          <span aria-hidden="true">👤</span> {incident.reporterName}
        </span>
        <span>
          <span aria-hidden="true">🕒</span> {fmtStamp(incident.createdAt)}
        </span>
      </div>
    </button>
  )
}
