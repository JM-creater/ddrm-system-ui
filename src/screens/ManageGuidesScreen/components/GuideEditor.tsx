import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { errorMessage, fieldErrors } from '../../../api/client'
import { INCIDENT_TYPES } from '../../../constants'
import type { Guide } from '../../../types'
import { steps } from '../../../utils/format'
import { PHASES } from '../constants/manageGuides.constants'
import { saveGuide } from '../services/manageGuidesService'

interface Props {
  guide: Guide
  onClose: () => void
  onSaved: (g: Guide) => void
}

export default function GuideEditor({ guide, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Guide>(() => ({
    ...guide,
    summary: guide.summary ?? '',
    beforeSteps: guide.beforeSteps ?? '',
    duringSteps: guide.duringSteps ?? '',
    afterSteps: guide.afterSteps ?? '',
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof Guide>(k: K, v: Guide[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k as string]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.hazard) errs.hazard = 'Choose the hazard.'
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (PHASES.every((p) => !steps(form[p.key]).length)) errs.beforeSteps = 'Add at least one step.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    const body = {
      hazard: form.hazard,
      title: form.title.trim(),
      summary: form.summary.trim() || null,
      beforeSteps: steps(form.beforeSteps).join('\n'),
      duringSteps: steps(form.duringSteps).join('\n'),
      afterSteps: steps(form.afterSteps).join('\n'),
      sortOrder: Number(form.sortOrder) || 0,
    }
    setSaving(true)
    try {
      const saved = await saveGuide(guide.id, body)
      toast.success(guide.id ? 'Guide updated.' : 'Guide published.')
      onSaved(saved)
    } catch (err) {
      setErrors(fieldErrors(err))
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show onHide={onClose} size="xl" backdrop={saving ? 'static' : true}>
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5 mb-0">
            {guide.id ? 'Edit guide' : 'New guide'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label htmlFor="g-title" className="req">
                Title
              </Form.Label>
              <Form.Control
                id="g-title"
                value={form.title}
                maxLength={120}
                onChange={(e) => set('title', e.target.value)}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label htmlFor="g-hazard" className="req">
                Hazard
              </Form.Label>
              <Form.Select
                id="g-hazard"
                value={form.hazard}
                onChange={(e) => set('hazard', e.target.value as Guide['hazard'])}
                isInvalid={!!errors.hazard}
              >
                <option value="">Select…</option>
                {INCIDENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.hazard}</Form.Control.Feedback>
            </Col>
            <Col md={2}>
              <Form.Label htmlFor="g-order">Order</Form.Label>
              <Form.Control
                id="g-order"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => set('sortOrder', Number(e.target.value))}
              />
            </Col>
            <Col xs={12}>
              <Form.Label htmlFor="g-sum">Short summary</Form.Label>
              <Form.Control
                id="g-sum"
                as="textarea"
                rows={2}
                maxLength={500}
                value={form.summary}
                onChange={(e) => set('summary', e.target.value)}
                isInvalid={!!errors.summary}
              />
              <Form.Control.Feedback type="invalid">{errors.summary}</Form.Control.Feedback>
            </Col>
            {PHASES.map((p) => (
              <Col lg={4} key={p.key}>
                <Form.Label htmlFor={`g-${p.key}`}>
                  {p.label} <span className="text-muted small">({steps(form[p.key]).length} steps)</span>
                </Form.Label>
                <Form.Control
                  id={`g-${p.key}`}
                  as="textarea"
                  rows={9}
                  maxLength={6000}
                  value={form[p.key]}
                  onChange={(e) => set(p.key, e.target.value)}
                  isInvalid={!!errors[p.key]}
                />
                <Form.Control.Feedback type="invalid">{errors[p.key]}</Form.Control.Feedback>
              </Col>
            ))}
          </Row>
          <p className="small text-muted mt-2 mb-0">Write one step per line. Empty lines are ignored.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving && <Spinner size="sm" className="me-2" />}
            {guide.id ? 'Save changes' : 'Publish guide'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
