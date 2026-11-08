import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Form } from 'react-bootstrap'
import type { PasswordInputProps } from '../types/login.types'

export default function PasswordInput({
  id,
  value,
  onChange,
  invalid,
  autoComplete,
  placeholder,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)
  return (
    <div className="pw-field">
      <Form.Control
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        isInvalid={invalid}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      <button type="button" className="eye" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}
