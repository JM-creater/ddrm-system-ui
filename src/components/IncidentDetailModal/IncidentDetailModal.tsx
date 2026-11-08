import { ExternalLink, Play } from 'lucide-react'
import { useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { api, errorMessage, fileUrl } from '../../api/client'
import { STATUSES } from '../../constants'
import type { Incident, IncidentStatus } from '../../types'
import { confirmAction } from '../../utils/dialogs'
import { fmtDateTime } from '../../utils/format'
import Lightbox from '../Lightbox/Lightbox'
import { SeverityTag, StatusTag } from '../ui/ui'
import './IncidentDetailModal.css'

interface Props {
  incident: Incident | null
  onClose: () => void
  /** Called after the report was changed (status) or withdrawn (null). */
  onChanged?: (updated: Incident | null, id: number) => void
  admin?: boolean
}

export default function IncidentDetailModal({ incident, ...rest }: Props) {
  if (!incident) return null
  // Keyed by id so the form state starts fresh for every report that is opened.
  return <DetailModal key={incident.id} incident={incident} {...rest} />
}

function DetailModal({ incident, onClose, onChanged, admin = false }: Props & { incident: Incident }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [status, setStatus] = useState<IncidentStatus>(incident.status)
  const [remarks, setRemarks] = useState(incident.remarks ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const mapUrl =
    incident.latitude !== null && incident.longitude !== null
      ? `https://www.openstreetmap.org/?mlat=${incident.latitude}&mlon=${incident.longitude}#map=18/${incident.latitude}/${incident.longitude}`
      : null

  const saveStatus = async () => {
    setSaving(true)
    try {
      const res = await api.patch<Incident>(`/admin/incidents/${incident.id}/status`, {
        status,
        remarks: remarks.trim() || null,
      })
      toast.success(`${res.data.reportNo} marked as ${res.data.statusLabel.toLowerCase()}.`)
      onChanged?.(res.data, incident.id)
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const withdraw = async () => {
    const ok = await confirmAction({
      title: admin ? 'Delete this report?' : 'Withdraw this report?',
      text: `${incident.reportNo} and its attachments will be removed permanently.`,
      confirmText: admin ? 'Delete report' : 'Withdraw report',
      danger: true,
    })
    if (!ok) return
    setDeleting(true)
    try {
      await api.delete(`/incidents/${incident.id}`)
      toast.success(admin ? 'Report deleted.' : 'Your report was withdrawn.')
      onChanged?.(null, incident.id)
      onClose()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const unchanged = status === incident.status && (remarks.trim() || '') === (incident.remarks ?? '')

  return (
    <>
      <Modal show={!!incident && lightbox === null} onHide={onClose} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {incident.typeLabel} report <span className="text-muted fw-normal fs-6 ms-1">{incident.reportNo}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <StatusTag status={incident.status} label={incident.statusLabel} />
            <SeverityTag severity={incident.severity} label={`${incident.severityLabel} severity`} />
          </div>

          <p style={{ whiteSpace: 'pre-line' }}>{incident.description}</p>

          <dl className="detail-grid mb-3">
            <dt>Purok</dt>
            <dd>{incident.purok}</dd>
            <dt>Exact location</dt>
            <dd>
              {incident.exactLocation || <span className="text-muted">Not given</span>}
              {mapUrl && (
                <div className="small">
                  {incident.latitude?.toFixed(6)}, {incident.longitude?.toFixed(6)} ·{' '}
                  <a href={mapUrl} target="_blank" rel="noreferrer">
                    Open map <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </dd>
            <dt>Reported by</dt>
            <dd>
              {incident.reporterName}
              {incident.reporterContact && (
                <>
                  {' · '}
                  <a href={`tel:${incident.reporterContact}`}>{incident.reporterContact}</a>
                </>
              )}
            </dd>
            <dt>Date filed</dt>
            <dd>{fmtDateTime(incident.createdAt)}</dd>
            {incident.reviewedByName && (
              <>
                <dt>Reviewed by</dt>
                <dd>
                  {incident.reviewedByName} · {fmtDateTime(incident.updatedAt)}
                </dd>
              </>
            )}
            {incident.remarks && !admin && (
              <>
                <dt>Barangay remarks</dt>
                <dd style={{ whiteSpace: 'pre-line' }}>{incident.remarks}</dd>
              </>
            )}
          </dl>

          <h3 className="h6 mb-2">Attachments</h3>
          {incident.media.length === 0 ? (
            <p className="text-muted small">No photo or video was attached.</p>
          ) : (
            <div className="gallery mb-3">
              {incident.media.map((m, idx) => (
                <button type="button" key={m.id} onClick={() => setLightbox(idx)} aria-label={`Open attachment ${idx + 1}`}>
                  {m.kind === 'VIDEO' ? (
                    <>
                      <video src={`${fileUrl(m.url)}#t=0.5`} preload="metadata" muted playsInline />
                      <span className="play">
                        <Play size={26} />
                      </span>
                    </>
                  ) : (
                    <img src={fileUrl(m.url)} alt="" loading="lazy" />
                  )}
                </button>
              ))}
            </div>
          )}

          {admin && (
            <div className="review-box mt-3">
              <h3 className="h6">Update status</h3>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="inc-status">Status</Form.Label>
                <Form.Select
                  id="inc-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IncidentStatus)}
                  style={{ maxWidth: 260 }}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="inc-remarks">Remarks to the resident</Form.Label>
                <Form.Control
                  id="inc-remarks"
                  as="textarea"
                  rows={3}
                  maxLength={500}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. BDRRMC team dispatched at 3:40 PM."
                />
                <Form.Text>{remarks.length}/500</Form.Text>
              </Form.Group>
              <Button onClick={saveStatus} disabled={saving || unchanged}>
                {saving && <Spinner size="sm" className="me-2" />}
                Save status
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div>
            {(incident.canDelete || admin) && (
              <Button variant="outline-danger" size="sm" onClick={withdraw} disabled={deleting}>
                {deleting && <Spinner size="sm" className="me-2" />}
                {admin ? 'Delete report' : 'Withdraw report'}
              </Button>
            )}
          </div>
          <Button variant="outline-secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Lightbox items={incident.media} index={lightbox} onIndex={setLightbox} />
    </>
  )
}
