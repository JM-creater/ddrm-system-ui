import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { errorMessage, fieldErrors } from '../../../api/client'
import { EMPTY_REGISTER_VALUES } from '../constants/login.constants'
import { useFinishAuth, validateRegister } from '../hooks/useLogin'
import { registerResident } from '../services/loginService'
import type { RegisterValues } from '../types/login.types'
import PasswordInput from './PasswordInput'

export default function RegisterForm({ puroks, onLogin }: { puroks: string[]; onLogin: () => void }) {
  const finish = useFinishAuth()
  const [v, setV] = useState<RegisterValues>(EMPTY_REGISTER_VALUES)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const set = (k: keyof RegisterValues) => (value: string) => {
    setV((old) => ({ ...old, [k]: value }))
    if (errors[k]) setErrors((old) => ({ ...old, [k]: '' }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateRegister(v, consent)
    setErrors(found)
    if (Object.values(found).some(Boolean)) return
    setBusy(true)
    try {
      const data = await registerResident({
        firstName: v.firstName.trim(),
        lastName: v.lastName.trim(),
        email: v.email.trim(),
        contactNumber: v.contactNumber.trim(),
        purok: v.purok,
        address: v.address.trim() || null,
        password: v.password,
      })
      toast.success('✅ Your resident account is ready.')
      finish(data)
    } catch (err) {
      const fe = fieldErrors(err)
      if (Object.keys(fe).length) setErrors(fe)
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Form onSubmit={submit} noValidate>
      <Row className="g-2">
        <Col sm={6}>
          <Form.Group>
            <Form.Label htmlFor="r-first" className="req">First Name</Form.Label>
            <Form.Control id="r-first" value={v.firstName} onChange={(e) => set('firstName')(e.target.value)} isInvalid={!!errors.firstName} maxLength={60} autoComplete="given-name" placeholder="Juan" />
            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group>
            <Form.Label htmlFor="r-last" className="req">Last Name</Form.Label>
            <Form.Control id="r-last" value={v.lastName} onChange={(e) => set('lastName')(e.target.value)} isInvalid={!!errors.lastName} maxLength={60} autoComplete="family-name" placeholder="Dela Cruz" />
            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={12}>
          <Form.Group>
            <Form.Label htmlFor="r-email" className="req">Email Address</Form.Label>
            <Form.Control id="r-email" type="email" value={v.email} onChange={(e) => set('email')(e.target.value)} isInvalid={!!errors.email} maxLength={120} autoComplete="email" placeholder="you@tabunok.gov.ph" />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group>
            <Form.Label htmlFor="r-phone" className="req">Mobile Number</Form.Label>
            <Form.Control id="r-phone" inputMode="tel" placeholder="09XXXXXXXXX" value={v.contactNumber} onChange={(e) => set('contactNumber')(e.target.value)} isInvalid={!!errors.contactNumber} maxLength={13} autoComplete="tel" />
            <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group>
            <Form.Label htmlFor="r-purok" className="req">Purok</Form.Label>
            <Form.Select id="r-purok" value={v.purok} onChange={(e) => set('purok')(e.target.value)} isInvalid={!!errors.purok}>
              <option value="">Select…</option>
              {puroks.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.purok}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={12}>
          <Form.Group>
            <Form.Label htmlFor="r-address">House No. / Street</Form.Label>
            <Form.Control id="r-address" value={v.address} onChange={(e) => set('address')(e.target.value)} isInvalid={!!errors.address} maxLength={160} autoComplete="street-address" />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group>
            <Form.Label htmlFor="r-pass" className="req">Password</Form.Label>
            <PasswordInput id="r-pass" value={v.password} onChange={set('password')} invalid={!!errors.password} autoComplete="new-password" placeholder="At least 8 characters" />
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group>
            <Form.Label htmlFor="r-confirm" className="req">Confirm Password</Form.Label>
            <Form.Control id="r-confirm" type="password" value={v.confirm} onChange={(e) => set('confirm')(e.target.value)} isInvalid={!!errors.confirm} autoComplete="new-password" />
            <Form.Control.Feedback type="invalid">{errors.confirm}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Form.Check
        className="mt-3 small"
        id="r-consent"
        checked={consent}
        onChange={(e) => {
          setConsent(e.target.checked)
          if (errors.consent) setErrors((o) => ({ ...o, consent: '' }))
        }}
        isInvalid={!!errors.consent}
        feedback={errors.consent}
        feedbackType="invalid"
        label="I allow Barangay Tabunok to keep my contact details for disaster response and warnings, as provided by the Data Privacy Act of 2012."
      />
      <Button type="submit" className="w-100 btn-block mt-3" disabled={busy}>
        {busy && <Spinner size="sm" className="me-2" />}
        Create Account →
      </Button>
      <div className="auth-note">
        <span aria-hidden="true">🏠</span> For residents of Barangay Tabunok only. Already registered?{' '}
        <button type="button" className="link" onClick={onLogin}>
          Sign in
        </button>
      </div>
    </Form>
  )
}
