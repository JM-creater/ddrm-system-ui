import { Form } from 'react-bootstrap'
import { INCIDENT_TYPES, STATUSES } from '../../../constants'

interface Props {
  q: string
  type: string
  status: string
  onSearch: (v: string) => void
  onUpdate: (patch: Record<string, string>) => void
}

export default function IncidentFilters({ q, type, status, onSearch, onUpdate }: Props) {
  return (
    <div className="filters">
      <Form.Control
        type="search"
        placeholder="Search purok / description…"
        value={q}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search reports"
      />
      <Form.Select value={type} onChange={(e) => onUpdate({ type: e.target.value })} aria-label="Filter by type">
        <option value="">All types</option>
        {INCIDENT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Form.Select>
      <Form.Select value={status} onChange={(e) => onUpdate({ status: e.target.value })} aria-label="Filter by status">
        <option value="">All status</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Form.Select>
    </div>
  )
}
