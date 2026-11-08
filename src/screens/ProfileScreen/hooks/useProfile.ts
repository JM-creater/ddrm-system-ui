import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'react-toastify'
import { errorMessage, fieldErrors } from '../../../api/client'
import { PHONE_PATTERN } from '../../../constants'
import { useAuth } from '../../../store/auth'
import { EMPTY_PASSWORD_FORM, MIN_PASSWORD_LENGTH } from '../constants/profile.constants'
import { fetchMyProfile, fetchPublicPuroks, updateMyPassword, updateMyProfile } from '../services/profileService'
import type { PasswordFormState, ProfileFormState } from '../types/profile.types'

export function useProfile() {
  const user = useAuth((s) => s.user)
  const setUser = useAuth((s) => s.setUser)
  const isAdmin = user?.role === 'ADMIN'
  const [puroks, setPuroks] = useState<string[]>([])

  const [form, setForm] = useState<ProfileFormState>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    contactNumber: user?.contactNumber ?? '',
    purok: user?.purok ?? '',
    address: user?.address ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const [pw, setPw] = useState<PasswordFormState>(EMPTY_PASSWORD_FORM)
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    void fetchPublicPuroks().then(setPuroks)
    fetchMyProfile()
      .then((u) => {
        setUser(u)
        setForm({
          firstName: u.firstName,
          lastName: u.lastName,
          contactNumber: u.contactNumber ?? '',
          purok: u.purok ?? '',
          address: u.address ?? '',
        })
      })
      .catch(() => undefined)
  }, [setUser])

  const set = (k: keyof ProfileFormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required.'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.'
    if (!PHONE_PATTERN.test(form.contactNumber.trim())) errs.contactNumber = 'Use a valid PH mobile number, e.g. 09171234567.'
    if (!isAdmin && !form.purok) errs.purok = 'Please choose your purok.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true)
    try {
      const updated = await updateMyProfile({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        contactNumber: form.contactNumber.trim(),
      })
      setUser(updated)
      toast.success('Your details were updated.')
    } catch (err) {
      setErrors(fieldErrors(err))
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!pw.currentPassword) errs.currentPassword = 'Enter your current password.'
    if (pw.newPassword.length < MIN_PASSWORD_LENGTH) errs.newPassword = 'Password must be at least 8 characters.'
    if (pw.confirm !== pw.newPassword) errs.confirm = 'The passwords do not match.'
    setPwErrors(errs)
    if (Object.keys(errs).length) return
    setPwSaving(true)
    try {
      await updateMyPassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword })
      setPw(EMPTY_PASSWORD_FORM)
      toast.success('Password changed. Use the new one the next time you sign in.')
    } catch (err) {
      setPwErrors(fieldErrors(err))
      toast.error(errorMessage(err))
    } finally {
      setPwSaving(false)
    }
  }

  const purokOptions = form.purok && !puroks.includes(form.purok) ? [form.purok, ...puroks] : puroks

  return {
    user,
    isAdmin,
    form,
    set,
    errors,
    saving,
    saveProfile,
    purokOptions,
    pw,
    setPw,
    pwErrors,
    pwSaving,
    changePassword,
  }
}
