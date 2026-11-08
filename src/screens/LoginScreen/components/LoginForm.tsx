import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { errorMessage } from '../../../api/client'
import { useFinishAuth } from '../hooks/useLogin'
import { loginUser } from '../services/loginService'
import PasswordInput from './PasswordInput'

export default function LoginForm({ onRegister }: { onRegister: () => void }) {
  const finish = useFinishAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email address and password.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const data = await loginUser({ email: email.trim(), password })
      toast.success(`✅ Welcome, ${data.user.firstName}!`)
      finish(data)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Form onSubmit={submit} noValidate>
      {error && (
        <div className="form-alert" role="alert">
          {error}
        </div>
      )}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="login-email">Email Address</Form.Label>
        <Form.Control
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@tabunok.gov.ph"
          autoFocus
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="login-password">Password</Form.Label>
        <PasswordInput id="login-password" value={password} onChange={setPassword} autoComplete="current-password" />
      </Form.Group>
      <Button type="submit" className="w-100 btn-block" disabled={busy}>
        {busy && <Spinner size="sm" className="me-2" />}
        Sign In →
      </Button>
      <div className="auth-note">
        <span aria-hidden="true">🔑</span> No account yet?{' '}
        <button type="button" className="link" onClick={onRegister}>
          Register as a resident
        </button>
        . Forgot your password? Ask the barangay DRRM office to reset it.
      </div>
    </Form>
  )
}
