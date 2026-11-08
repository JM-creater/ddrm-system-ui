import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { Panel } from '../../../components/ui/ui'
import type { PasswordFormState } from '../types/profile.types'

interface Props {
  pw: PasswordFormState
  setPw: Dispatch<SetStateAction<PasswordFormState>>
  pwErrors: Record<string, string>
  pwSaving: boolean
  onSubmit: (e: FormEvent) => void
}

export default function ChangePasswordForm({ pw, setPw, pwErrors, pwSaving, onSubmit }: Props) {
  return (
    <Form onSubmit={onSubmit} noValidate>
      <Panel
        title="Change password"
        footer={
          <div className="text-end">
            <Button type="submit" variant="outline-primary" disabled={pwSaving}>
              {pwSaving && <Spinner size="sm" className="me-2" />}
              Update password
            </Button>
          </div>
        }
      >
        <Form.Group className="mb-3">
          <Form.Label htmlFor="pw-cur">Current password</Form.Label>
          <Form.Control
            id="pw-cur"
            type="password"
            autoComplete="current-password"
            value={pw.currentPassword}
            onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
            isInvalid={!!pwErrors.currentPassword}
          />
          <Form.Control.Feedback type="invalid">{pwErrors.currentPassword}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="pw-new">New password</Form.Label>
          <Form.Control
            id="pw-new"
            type="password"
            autoComplete="new-password"
            maxLength={72}
            value={pw.newPassword}
            onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
            isInvalid={!!pwErrors.newPassword}
          />
          <Form.Control.Feedback type="invalid">{pwErrors.newPassword}</Form.Control.Feedback>
          <Form.Text>8 to 72 characters. A short sentence is easier to remember.</Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="pw-conf">Confirm new password</Form.Label>
          <Form.Control
            id="pw-conf"
            type="password"
            autoComplete="new-password"
            value={pw.confirm}
            onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
            isInvalid={!!pwErrors.confirm}
          />
          <Form.Control.Feedback type="invalid">{pwErrors.confirm}</Form.Control.Feedback>
        </Form.Group>
      </Panel>
    </Form>
  )
}
