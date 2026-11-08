import { Pencil, Trash2 } from 'lucide-react'
import { Button, Table } from 'react-bootstrap'
import type { Guide } from '../../../types'
import { fmtDate, steps } from '../../../utils/format'

interface Props {
  guides: Guide[]
  onEdit: (g: Guide) => void
  onRemove: (g: Guide) => void
}

export default function GuidesTable({ guides, onEdit, onRemove }: Props) {
  return (
    <div className="table-responsive">
      <Table className="mb-0 align-middle">
        <thead>
          <tr>
            <th style={{ width: 60 }}>Order</th>
            <th>Guide</th>
            <th>Hazard</th>
            <th className="text-center">Before / During / After</th>
            <th>Updated</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guides.map((g) => (
            <tr key={g.id}>
              <td className="tabular text-muted">{g.sortOrder}</td>
              <td>
                <div className="fw-semibold">{g.title}</div>
                {g.summary && (
                  <div className="small text-muted text-truncate" style={{ maxWidth: 560 }}>
                    {g.summary}
                  </div>
                )}
              </td>
              <td>{g.hazardLabel}</td>
              <td className="text-center tabular">
                {steps(g.beforeSteps).length} / {steps(g.duringSteps).length} / {steps(g.afterSteps).length}
              </td>
              <td className="small text-nowrap">{fmtDate(g.updatedAt)}</td>
              <td className="text-end text-nowrap">
                <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => onEdit(g)} aria-label="Edit">
                  <Pencil size={14} />
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => onRemove(g)} aria-label="Delete">
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
