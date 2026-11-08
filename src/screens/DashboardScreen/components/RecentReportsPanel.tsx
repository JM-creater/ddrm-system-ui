import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { EmptyState, Panel, StatusTag } from '../../../components/ui/ui'
import { fromNow } from '../../../utils/format'
import type { RecentReportsPanelProps } from '../types/dashboard.types'

export default function RecentReportsPanel({ reports, totalCount, onSelect }: RecentReportsPanelProps) {
  return (
    <Panel
      title="🧾 My Recent Reports"
      bodyClass=""
      actions={
        <Link to="/incidents?mine=1" className="small fw-semibold">
          View all ({totalCount})
        </Link>
      }
    >
      {reports.length === 0 ? (
        <EmptyState title="You have not filed any report">
          If you see flooding, fallen trees, fire or other hazards, <Link to="/report">send a report</Link> with a photo.
        </EmptyState>
      ) : (
        <div className="table-responsive">
          <Table hover className="table-clickable">
            <thead>
              <tr>
                <th>Report No.</th>
                <th>Type</th>
                <th>Purok</th>
                <th>Filed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((i) => (
                <tr key={i.id} onClick={() => onSelect(i)}>
                  <td className="tabular">{i.reportNo}</td>
                  <td>{i.typeLabel}</td>
                  <td>{i.purok}</td>
                  <td className="text-muted">{fromNow(i.createdAt)}</td>
                  <td>
                    <StatusTag status={i.status} label={i.statusLabel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Panel>
  )
}
