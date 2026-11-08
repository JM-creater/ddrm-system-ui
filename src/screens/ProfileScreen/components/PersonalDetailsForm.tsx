import type { FormEvent } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { Panel } from '../../../components/ui/ui'
import type { ProfileFormState } from '../types/profile.types'

interface Props {
  form: ProfileFormState
  isAdmin: boolean
  purokOptions: string[]
  errors: Record<string, string>
  saving: boolean
  onChange: (k: keyof ProfileFormState, v: string) => void
  onSubmit: (e: FormEvent) => void
}

export default function PersonalDetailsForm({
  form,
  isAdmin,
  purokOptions,
  errors,
  saving,
  onChange,
  onSubmit,
}: Props) {
  return (
    <Form onSubmit={onSubmit} noValidate>
      <Panel
        title="Personal details"
        footer={
          <div className="text-end">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving && <Spinner size="sm" className="me-2" />}
              Save changes
            </Button>
          </div>
        }
      >
        <Row className="g-3">
          <Col sm={6}>
            <Form.Label htmlFor="pf-first" className="req">
              First name
            </Form.Label>
            <Form.Control
              id="pf-first"
              value={form.firstName}
              maxLength={60}
              onChange={(e) => onChange('firstName', e.target.value)}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
          </Col>
          <Col sm={6}>
            <Form.Label htmlFor="pf-last" className="req">
              Last name
            </Form.Label>
            <Form.Control
              id="pf-last"
              value={form.lastName}
              maxLength={60}
              onChange={(e) => onChange('lastName', e.target.value)}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
          </Col>
          <Col sm={6}>
            <Form.Label htmlFor="pf-phone" className="req">
              Mobile number
            </Form.Label>
            <Form.Control
              id="pf-phone"
              type="tel"
              inputMode="tel"
              value={form.contactNumber}
              maxLength={13}
              placeholder="09XXXXXXXXX"
              onChange={(e) => onChange('contactNumber', e.target.value)}
              isInvalid={!!errors.contactNumber}
            />
            <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>
          </Col>
          <Col sm={6}>
            <Form.Label htmlFor="pf-purok" className={isAdmin ? '' : 'req'}>
              Purok
            </Form.Label>
            <Form.Select
              id="pf-purok"
              value={form.purok}
              onChange={(e) => onChange('purok', e.target.value)}
              isInvalid={!!errors.purok}
            >
              <option value="">{isAdmin ? 'Not applicable' : 'Select…'}</option>
              {purokOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.purok}</Form.Control.Feedback>
          </Col>
          <Col xs={12}>
            <Form.Label htmlFor="pf-addr">House no. / street</Form.Label>
            <Form.Control
              id="pf-addr"
              value={form.address}
              maxLength={160}
              onChange={(e) => onChange('address', e.target.value)}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Col>
        </Row>
      </Panel>
    </Form>
  )
}
