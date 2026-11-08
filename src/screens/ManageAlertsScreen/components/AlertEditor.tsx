import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { errorMessage, fieldErrors } from '../../../api/client'
import { ALERT_LEVELS, INCIDENT_TYPES } from '../../../constants'
import type { Alert, AlertForm } from '../../../types'
import { EMPTY_ALERT_FORM } from '../constants/manageAlerts.constants'
import { saveAlert } from '../services/manageAlertsService'

interface Props {
  alert: Alert | null
  onClose: () => void
  onSaved: (a: Alert, created: boolean) => void
}

export default function AlertEditor({ alert, onClose, onSaved }: Props) {
  const [form, setForm] = useState<AlertForm>(() =>
    alert
      ? {
          title: alert.title,
          message: alert.message,
          level: alert.level,
          hazard: alert.hazard ?? '',
          affectedArea: alert.affectedArea ?? '',
        }
      : EMPTY_ALERT_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof AlertForm>(k: K, v: AlertForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.level) errs.level = 'Choose the warning level.'
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.message.trim()) errs.message = 'Message is required.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    const body = {
      title: form.title.trim(),
      message: form.message.trim(),
      level: form.level,
      hazard: form.hazard || null,
      affectedArea: form.affectedArea.trim() || null,
    }
    setSaving(true)
    try {
      const saved = await saveAlert(alert?.id, body)
      toast.success(alert ? 'Notice updated.' : 'Notice posted. Residents will see it on their dashboard.')
      onSaved(saved, !alert)
    } catch (err) {
      setErrors(fieldErrors(err))
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show onHide={onClose} size="lg" backdrop={saving ? 'static' : true}>
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5 mb-0">
            {alert ? 'Edit notice' : 'New warning or advisory'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label className="req">Level</Form.Label>
          <div className="choice-grid mb-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
            {ALERT_LEVELS.map((l) => (
              <label key={l.value} className={`choice sev-choice ${form.level === l.value ? 'on' : ''} ${errors.level ? 'invalid' : ''}`}>
                <input type="radio" name="level" checked={form.level === l.value} onChange={() => set('level', l.value)} />
                <span className={`dot lvl-${l.value}`} />
                <span>
                  {l.label}
                  <span className="hint">{l.meaning}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.level && <div className="invalid-feedback d-block">{errors.level}</div>}

          <Row className="g-3 mt-1">
            <Col md={8}>
              <Form.Label htmlFor="al-title" className="req">
                Title
              </Form.Label>
              <Form.Control
                id="al-title"
                value={form.title}
                maxLength={150}
                onChange={(e) => set('title', e.target.value)}
                isInvalid={!!errors.title}
                placeholder="e.g. Tropical Storm Signal No. 2 raised over Cebu"
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label htmlFor="al-hazard">Hazard</Form.Label>
              <Form.Select id="al-hazard" value={form.hazard} onChange={(e) => set('hazard', e.target.value as AlertForm['hazard'])}>
                <option value="">General</option>
                {INCIDENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12}>
              <Form.Label htmlFor="al-area">Affected area</Form.Label>
              <Form.Control
                id="al-area"
                value={form.affectedArea}
                maxLength={150}
                onChange={(e) => set('affectedArea', e.target.value)}
                isInvalid={!!errors.affectedArea}
                placeholder="e.g. Puroks 3, 4 and 7 near the river. Leave blank for the whole barangay."
              />
              <Form.Control.Feedback type="invalid">{errors.affectedArea}</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Label htmlFor="al-msg" className="req">
                Message to residents
              </Form.Label>
              <Form.Control
                id="al-msg"
                as="textarea"
                rows={5}
                maxLength={2000}
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                isInvalid={!!errors.message}
                placeholder="What is happening, what residents should do, and where to go."
              />
              <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
              <Form.Text>{form.message.length}/2000</Form.Text>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving && <Spinner size="sm" className="me-2" />}
            {alert ? 'Save changes' : 'Post notice'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
