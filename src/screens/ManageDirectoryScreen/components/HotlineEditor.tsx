import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import type { Hotline } from '../../../types'
import { blank } from '../constants/manageDirectory.constants'
import { useSaver } from '../hooks/useManageDirectory'

interface Props {
  hotline: Hotline
  onClose: () => void
  onSaved: (h: Hotline) => void
}

export default function HotlineEditor({ hotline, onClose, onSaved }: Props) {
  const [form, setForm] = useState(() => ({
    agency: hotline.agency ?? '',
    number: hotline.number ?? '',
    description: hotline.description ?? '',
    sortOrder: String(hotline.sortOrder ?? 0),
  }))
  const { errors, setErrors, saving, save } = useSaver<Hotline>('/admin/directory/hotlines', onSaved)

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.agency.trim()) errs.agency = 'Agency is required.'
    if (!form.number.trim()) errs.number = 'Number is required.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    void save(
      hotline.id,
      {
        agency: form.agency.trim(),
        number: form.number.trim(),
        description: blank(form.description),
        sortOrder: Number(form.sortOrder) || 0,
      },
      hotline.id ? 'Hotline updated.' : 'Hotline added.',
    )
  }

  return (
    <Modal show onHide={onClose} backdrop={saving ? 'static' : true}>
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5 mb-0">
            {hotline.id ? 'Edit hotline' : 'Add hotline'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="h-agency" className="req">
              Agency / office
            </Form.Label>
            <Form.Control id="h-agency" value={form.agency} maxLength={120} onChange={(e) => set('agency', e.target.value)} isInvalid={!!errors.agency} />
            <Form.Control.Feedback type="invalid">{errors.agency}</Form.Control.Feedback>
          </Form.Group>
          <Row className="g-3 mb-3">
            <Col xs={8}>
              <Form.Label htmlFor="h-num" className="req">
                Number
              </Form.Label>
              <Form.Control id="h-num" value={form.number} maxLength={40} onChange={(e) => set('number', e.target.value)} isInvalid={!!errors.number} />
              <Form.Control.Feedback type="invalid">{errors.number}</Form.Control.Feedback>
            </Col>
            <Col xs={4}>
              <Form.Label htmlFor="h-order">Order</Form.Label>
              <Form.Control id="h-order" type="number" min={0} value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} />
            </Col>
          </Row>
          <Form.Group>
            <Form.Label htmlFor="h-desc">Description</Form.Label>
            <Form.Control id="h-desc" value={form.description} maxLength={200} onChange={(e) => set('description', e.target.value)} isInvalid={!!errors.description} placeholder="e.g. Fire, rescue and medical emergencies" />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving && <Spinner size="sm" className="me-2" />}
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
