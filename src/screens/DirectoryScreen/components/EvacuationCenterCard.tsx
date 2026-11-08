import { MapPin, Users } from 'lucide-react'
import type { EvacuationCenter } from '../../../types'

export default function EvacuationCenterCard({ center: c }: { center: EvacuationCenter }) {
  return (
    <div className="center-card">
      <div className="d-flex justify-content-between gap-2 mb-1">
        <span className="nm">{c.name}</span>
        <span className={`open-dot ${c.open ? 'yes' : 'no'}`}>{c.open ? 'Open' : 'Closed'}</span>
      </div>
      <div className="small mb-1 meta-inline">
        <MapPin size={13} /> {c.location}
      </div>
      {c.puroksServed && <div className="small text-muted mb-1">Serves: {c.puroksServed}</div>}
      {c.capacity !== null && (
        <div className="small text-muted mb-1 meta-inline">
          <Users size={13} /> Holds about {c.capacity} persons
        </div>
      )}
      {(c.contactPerson || c.contactNumber) && (
        <div className="small mt-2 pt-2 border-top">
          {c.contactPerson}
          {c.contactNumber && (
            <>
              {c.contactPerson && ' · '}
              <a>{c.contactNumber}</a>
            </>
          )}
        </div>
      )}
    </div>
  )
}
