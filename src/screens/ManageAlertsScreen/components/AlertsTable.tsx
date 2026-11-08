import { Pencil, Trash2 } from 'lucide-react'
import { Button, Table } from 'react-bootstrap'
import type { Alert } from '../../../types'
import { fmtDateTime } from '../../../utils/format'

interface Props {
  alerts: Alert[]
  busyId: number | null
  onToggle: (a: Alert) => void
  onEdit: (a: Alert) => void
  onRemove: (a: Alert) => void
}

export default function AlertsTable({ alerts, busyId, onToggle, onEdit, onRemove }: Props) {
  return (
    <div className="table-responsive">
      <Table className="mb-0 align-middle">
        <thead>
          <tr>
            <th>Level</th>
            <th>Notice</th>
            <th>Issued</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a.id} className={a.active ? '' : 'text-muted'}>
              <td className="text-nowrap">
                <span className={`lvl-chip lvl-${a.level} d-inline-block me-2 align-middle`} style={{ marginTop: 0 }} />
                {a.levelLabel}
              </td>
              <td style={{ minWidth: 240 }}>
                <div className="fw-semibold">{a.title}</div>
                <div className="small text-muted">
                  {[a.hazardLabel, a.affectedArea].filter(Boolean).join(' · ') || 'All puroks'}
                </div>
              </td>
              <td className="small text-nowrap">
                {fmtDateTime(a.createdAt)}
                {a.postedBy && <div className="text-muted">{a.postedBy}</div>}
              </td>
              <td className="text-nowrap">
                {a.active ? (
                  <span className="open-dot yes">In effect</span>
                ) : (
                  <span className="small">Lifted {fmtDateTime(a.liftedAt)}</span>
                )}
              </td>
              <td className="text-end text-nowrap">
                <Button
                  size="sm"
                  variant={a.active ? 'outline-secondary' : 'outline-primary'}
                  className="me-1"
                  disabled={busyId === a.id}
                  onClick={() => onToggle(a)}
                >
                  {a.active ? 'Lift' : 'Reactivate'}
                </Button>
                <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => onEdit(a)} aria-label="Edit">
                  <Pencil size={14} />
                </Button>
                <Button size="sm" variant="outline-danger" disabled={busyId === a.id} onClick={() => onRemove(a)} aria-label="Delete">
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
