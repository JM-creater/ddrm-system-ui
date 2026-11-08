import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { EmptyState, Panel, SeverityTag } from '../../../components/ui/ui'
import { fromNow } from '../../../utils/format'
import type { PendingQueuePanelProps } from '../types/adminOverview.types'

export default function PendingQueuePanel({ pendingQueue, onSelect }: PendingQueuePanelProps) {
  return (
    <Panel
      title="Pending reports"
      bodyClass=""
      className="h-100"
      actions={
        <Link to="/admin/incidents?status=PENDING" className="small">
          See all
        </Link>
      }
    >
      {pendingQueue.length === 0 ? (
        <EmptyState title="Nothing to review">All reports from residents have been acted on.</EmptyState>
      ) : (
        <div className="table-responsive">
          <Table hover className="table-clickable mb-0">
            <thead>
              <tr>
                <th>Report</th>
                <th>Severity</th>
                <th>Purok</th>
                <th>Reporter</th>
                <th>Filed</th>
              </tr>
            </thead>
            <tbody>
              {pendingQueue.map((i) => (
                <tr key={i.id} onClick={() => onSelect(i)}>
                  <td>
                    <div className="fw-semibold">{i.typeLabel}</div>
                    <div className="small text-muted tabular">{i.reportNo}</div>
                  </td>
                  <td>
                    <SeverityTag severity={i.severity} label={i.severityLabel} />
                  </td>
                  <td>{i.purok}</td>
                  <td>{i.reporterName}</td>
                  <td className="text-muted text-nowrap">{fromNow(i.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Panel>
  )
}
