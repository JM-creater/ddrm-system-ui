import { Search } from 'lucide-react'
import { Button, Form } from 'react-bootstrap'
import { INCIDENT_TYPES, STATUSES } from '../../../constants'
import type { ManageIncidentsToolbarProps } from '../types/manageIncidents.types'

export default function ManageIncidentsToolbar({
  q,
  status,
  type,
  purok,
  puroks,
  filtered,
  onSearch,
  onUpdate,
  onClear,
}: ManageIncidentsToolbarProps) {
  return (
    <div className="toolbar">
      <div className="search">
        <Search size={16} />
        <Form.Control
          type="search"
          placeholder="Search report no., description, location or reporter"
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search reports"
        />
      </div>
      <Form.Select value={status} onChange={(e) => onUpdate({ status: e.target.value })} aria-label="Status">
        <option value="">Any status</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Form.Select>
      <Form.Select value={type} onChange={(e) => onUpdate({ type: e.target.value })} aria-label="Type">
        <option value="">All types</option>
        {INCIDENT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Form.Select>
      <Form.Select value={purok} onChange={(e) => onUpdate({ purok: e.target.value })} aria-label="Purok">
        <option value="">All puroks</option>
        {puroks.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </Form.Select>
      {filtered && (
        <Button variant="link" size="sm" onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  )
}
