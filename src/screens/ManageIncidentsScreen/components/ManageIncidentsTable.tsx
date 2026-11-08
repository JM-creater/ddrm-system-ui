import { Camera, Film } from 'lucide-react'
import { Table } from 'react-bootstrap'
import { SeverityTag, StatusTag } from '../../../components/ui/ui'
import { fmtDateTime } from '../../../utils/format'
import type { ManageIncidentsTableProps } from '../types/manageIncidents.types'

export default function ManageIncidentsTable({ items, loading, onSelect }: ManageIncidentsTableProps) {
  return (
    <div className="table-responsive" style={{ opacity: loading ? 0.6 : 1 }}>
      <Table hover className="table-clickable mb-0 align-middle">
        <thead>
          <tr>
            <th>Report no.</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Purok / location</th>
            <th>Reporter</th>
            <th>Filed</th>
            <th>Media</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => {
            const photos = i.media.filter((m) => m.kind === 'PHOTO').length
            const video = i.media.some((m) => m.kind === 'VIDEO')
            return (
              <tr key={i.id} onClick={() => onSelect(i)}>
                <td className="tabular text-nowrap">{i.reportNo}</td>
                <td>{i.typeLabel}</td>
                <td>
                  <SeverityTag severity={i.severity} label={i.severityLabel} />
                </td>
                <td>
                  {i.purok}
                  {i.exactLocation && (
                    <div className="small text-muted text-truncate" style={{ maxWidth: 360 }}>
                      {i.exactLocation}
                    </div>
                  )}
                </td>
                <td>
                  {i.reporterName}
                  {i.reporterContact && <div className="small text-muted">{i.reporterContact}</div>}
                </td>
                <td className="text-nowrap small">{fmtDateTime(i.createdAt)}</td>
                <td className="text-nowrap text-muted small">
                  {photos > 0 && (
                    <span className="meta-inline me-2">
                      <Camera size={13} /> {photos}
                    </span>
                  )}
                  {video && (
                    <span className="meta-inline">
                      <Film size={13} /> 1
                    </span>
                  )}
                  {!photos && !video && '—'}
                </td>
                <td>
                  <StatusTag status={i.status} label={i.statusLabel} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}
