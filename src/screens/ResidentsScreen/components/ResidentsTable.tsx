import { Button, Table } from 'react-bootstrap'
import { fmtDate } from '../../../utils/format'
import type { ResidentsTableProps } from '../types/residents.types'

export default function ResidentsTable({ residents, loading, busyId, onToggle }: ResidentsTableProps) {
  return (
    <div className="table-responsive" style={{ opacity: loading ? 0.6 : 1 }}>
      <Table className="mb-0 align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Purok / address</th>
            <th>Registered</th>
            <th>Status</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((u) => (
            <tr key={u.id} className={u.enabled ? '' : 'text-muted'}>
              <td className="fw-semibold">{u.fullName}</td>
              <td className="small">
                <div>{u.email}</div>
                {u.contactNumber && <div className="text-muted">{u.contactNumber}</div>}
              </td>
              <td className="small">
                {u.purok ?? '—'}
                {u.address && <div className="text-muted">{u.address}</div>}
              </td>
              <td className="small text-nowrap">{fmtDate(u.createdAt)}</td>
              <td>
                <span className={`open-dot ${u.enabled ? 'yes' : 'no'}`}>{u.enabled ? 'Active' : 'Deactivated'}</span>
              </td>
              <td className="text-end">
                <Button
                  size="sm"
                  variant={u.enabled ? 'outline-danger' : 'outline-primary'}
                  disabled={busyId === u.id}
                  onClick={() => onToggle(u)}
                >
                  {u.enabled ? 'Deactivate' : 'Reactivate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
