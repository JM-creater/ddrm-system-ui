import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PHONE_PATTERN } from '../../../constants'
import { homePathFor, useAuth } from '../../../store/auth'
import type { AuthResponse } from '../../../types'
import { EMAIL_PATTERN, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../constants/login.constants'
import { fetchPublicPuroks } from '../services/loginService'
import type { AuthTab, RegisterValues } from '../types/login.types'

export function useLoginScreen() {
  const location = useLocation()
  const [tab, setTab] = useState<AuthTab>(location.pathname === '/register' ? 'register' : 'login')
  const [puroks, setPuroks] = useState<string[]>([])

  useEffect(() => {
    void fetchPublicPuroks().then(setPuroks)
  }, [])

  return { tab, setTab, puroks }
}

export function useFinishAuth() {
  const signIn = useAuth((s) => s.signIn)
  const navigate = useNavigate()
  const location = useLocation()
  return (res: AuthResponse) => {
    signIn(res)
    const from = (location.state as { from?: string } | null)?.from
    const home = homePathFor(res.user)
    const allowed = from && (res.user.role === 'ADMIN' ? from.startsWith('/admin') : !from.startsWith('/admin'))
    navigate(allowed ? from : home, { replace: true })
  }
}

export function validateRegister(v: RegisterValues, consent: boolean): Record<string, string> {
  const e: Record<string, string> = {}
  if (!v.firstName.trim()) e.firstName = 'First name is required.'
  if (!v.lastName.trim()) e.lastName = 'Last name is required.'
  if (!v.email.trim()) e.email = 'Email address is required.'
  else if (!EMAIL_PATTERN.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (!v.contactNumber.trim()) e.contactNumber = 'Mobile number is required.'
  else if (!PHONE_PATTERN.test(v.contactNumber.trim())) e.contactNumber = 'Use a valid PH mobile number, e.g. 09171234567.'
  if (!v.purok) e.purok = 'Please choose your purok.'
  if (v.password.length < MIN_PASSWORD_LENGTH) e.password = 'Password must be at least 8 characters.'
  else if (v.password.length > MAX_PASSWORD_LENGTH) e.password = 'Password must be 72 characters or less.'
  if (v.confirm !== v.password) e.confirm = 'Passwords do not match.'
  if (!consent) e.consent = 'Please agree before creating your account.'
  return e
}
