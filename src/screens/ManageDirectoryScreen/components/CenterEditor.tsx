import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import type { EvacuationCenter } from '../../../types'
import { blank } from '../constants/manageDirectory.constants'
import { useSaver } from '../hooks/useManageDirectory'

interface Props {
  center: EvacuationCenter
  onClose: () => void
  onSaved: (c: EvacuationCenter) => void
}

export default function CenterEditor({ center, onClose, onSaved }: Props) {
  const [form, setForm] = useState(() => ({
    name: center.name ?? '',
    location: center.location ?? '',
    puroksServed: center.puroksServed ?? '',
    capacity: center.capacity === null ? '' : String(center.capacity),
    contactPerson: center.contactPerson ?? '',
    contactNumber: center.contactNumber ?? '',
    open: center.open,
  }))
  const { errors, setErrors, saving, save } = useSaver<EvacuationCenter>('/admin/directory/centers', onSaved)

  const set = (k: keyof typeof form, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.location.trim()) errs.location = 'Location is required.'
    if (form.capacity && (!/^\d+$/.test(form.capacity) || Number(form.capacity) < 0)) errs.capacity = 'Enter a whole number.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    void save(
      center.id,
      {
        name: form.name.trim(),
        location: form.location.trim(),
        puroksServed: blank(form.puroksServed),
        capacity: form.capacity ? Number(form.capacity) : null,
        contactPerson: blank(form.contactPerson),
        contactNumber: blank(form.contactNumber),
        open: form.open,
      },
      center.id ? 'Evacuation center updated.' : 'Evacuation center added.',
    )
  }

  return (
    <Modal show onHide={onClose} size="lg" backdrop={saving ? 'static' : true}>
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5 mb-0">
            {center.id ? 'Edit evacuation center' : 'Add evacuation center'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={7}>
              <Form.Label htmlFor="c-name" className="req">
                Name
              </Form.Label>
              <Form.Control id="c-name" value={form.name} maxLength={120} onChange={(e) => set('name', e.target.value)} isInvalid={!!errors.name} placeholder="e.g. Tabunok Elementary School" />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Col>
            <Col md={5}>
              <Form.Label htmlFor="c-cap">Capacity (persons)</Form.Label>
              <Form.Control id="c-cap" inputMode="numeric" value={form.capacity} onChange={(e) => set('capacity', e.target.value)} isInvalid={!!errors.capacity} />
              <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Label htmlFor="c-loc" className="req">
                Location
              </Form.Label>
              <Form.Control id="c-loc" value={form.location} maxLength={200} onChange={(e) => set('location', e.target.value)} isInvalid={!!errors.location} />
              <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Label htmlFor="c-puroks">Puroks served</Form.Label>
              <Form.Control id="c-puroks" value={form.puroksServed} maxLength={150} onChange={(e) => set('puroksServed', e.target.value)} isInvalid={!!errors.puroksServed} placeholder="e.g. Purok 1, Purok 2, Purok 3" />
              <Form.Control.Feedback type="invalid">{errors.puroksServed}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="c-person">Contact person</Form.Label>
              <Form.Control id="c-person" value={form.contactPerson} maxLength={100} onChange={(e) => set('contactPerson', e.target.value)} isInvalid={!!errors.contactPerson} />
              <Form.Control.Feedback type="invalid">{errors.contactPerson}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="c-num">Contact number</Form.Label>
              <Form.Control id="c-num" value={form.contactNumber} maxLength={30} onChange={(e) => set('contactNumber', e.target.value)} isInvalid={!!errors.contactNumber} />
              <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Check type="switch" id="c-open" label="Open and accepting evacuees" checked={form.open} onChange={(e) => set('open', e.target.checked)} />
            </Col>
          </Row>
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
