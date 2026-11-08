import { X } from 'lucide-react'
import { Button, Col, Form, ProgressBar, Row, Spinner } from 'react-bootstrap'
import { Panel } from '../../../components/ui/ui'
import { INCIDENT_TYPES, SEVERITIES } from '../../../constants'
import type { IncidentType, Severity } from '../../../types'
import type { GpsCoords } from '../types/reportIncident.types'

interface Props {
  type: IncidentType | ''
  setType: (v: IncidentType | '') => void
  severity: Severity | ''
  setSeverity: (v: Severity | '') => void
  purok: string
  setPurok: (v: string) => void
  purokOptions: string[]
  description: string
  setDescription: (v: string) => void
  exactLocation: string
  setExactLocation: (v: string) => void
  coords: GpsCoords | null
  setCoords: (v: GpsCoords | null) => void
  locating: boolean
  locate: () => void
  submitting: boolean
  preparing: boolean
  progress: number | null
  errors: Record<string, string>
  clearError: (k: string) => void
}

export default function IncidentDetailsForm({
  type,
  setType,
  severity,
  setSeverity,
  purok,
  setPurok,
  purokOptions,
  description,
  setDescription,
  exactLocation,
  setExactLocation,
  coords,
  setCoords,
  locating,
  locate,
  submitting,
  preparing,
  progress,
  errors,
  clearError,
}: Props) {
  return (
    <Panel title="Incident Details">
      <Form.Group className="mb-3">
        <Form.Label htmlFor="type" className="req">
          Hazard / Incident Type
        </Form.Label>
        <Form.Select
          id="type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as IncidentType | '')
            clearError('type')
          }}
          isInvalid={!!errors.type}
        >
          <option value="">Select type…</option>
          {INCIDENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
      </Form.Group>

      <Row className="g-3 mb-3">
        <Col sm={6}>
          <Form.Group>
            <Form.Label htmlFor="severity" className="req">
              Severity
            </Form.Label>
            <Form.Select
              id="severity"
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value as Severity | '')
                clearError('severity')
              }}
              isInvalid={!!errors.severity}
            >
              <option value="">Select…</option>
              {SEVERITIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.severity}</Form.Control.Feedback>
            {severity && <Form.Text>{SEVERITIES.find((s) => s.value === severity)?.hint}</Form.Text>}
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group>
            <Form.Label htmlFor="purok" className="req">
              Location (Purok)
            </Form.Label>
            <Form.Select
              id="purok"
              value={purok}
              onChange={(e) => {
                setPurok(e.target.value)
                clearError('purok')
              }}
              isInvalid={!!errors.purok}
            >
              <option value="">Select…</option>
              {purokOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.purok}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="desc" className="req">
          Description
        </Form.Label>
        <Form.Control
          id="desc"
          as="textarea"
          rows={3}
          maxLength={1000}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            clearError('description')
          }}
          isInvalid={!!errors.description}
          placeholder="What happened? Which houses / how many people affected?"
        />
        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <div className="d-flex align-items-center gap-2 mb-1">
          <Form.Label htmlFor="exact" className="mb-0">
            Exact location
          </Form.Label>
          <button type="button" className="gps-btn" onClick={locate} disabled={locating}>
            {locating ? <Spinner size="sm" /> : <span aria-hidden="true">📍</span>} Use my GPS
          </button>
        </div>
        <Form.Control
          id="exact"
          value={exactLocation}
          maxLength={200}
          onChange={(e) => setExactLocation(e.target.value)}
          isInvalid={!!errors.exactLocation}
          placeholder="Nearest landmark / GPS coordinates"
        />
        <Form.Control.Feedback type="invalid">{errors.exactLocation}</Form.Control.Feedback>
        {coords && (
          <span className="gps-box mt-2">
            📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            <span className="text-muted">±{coords.acc} m</span>
            <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setCoords(null)} aria-label="Remove location">
              <X size={14} />
            </button>
          </span>
        )}
      </Form.Group>

      {submitting && (
        <div className="mb-2">
          <ProgressBar now={progress ?? 0} label={`${progress}%`} style={{ height: 16 }} />
          <div className="small text-muted mt-1">Uploading… keep this page open.</div>
        </div>
      )}
      <Button type="submit" className="w-100 btn-block" disabled={submitting || preparing}>
        {submitting && <Spinner size="sm" className="me-2" />}
        Submit Report ➤
      </Button>
    </Panel>
  )
}
