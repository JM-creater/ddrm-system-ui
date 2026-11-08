import { useState } from 'react'
import { toast } from 'react-toastify'
import { errorMessage, fieldErrors } from '../../../api/client'
import { useLoad } from '../../../hooks'
import type { EvacuationCenter, Hotline } from '../../../types'
import { confirmAction } from '../../../utils/dialogs'
import {
  deleteCenterById,
  deleteHotlineById,
  fetchManageDirectoryData,
  saveDirectoryResource,
  updateCenterOpenStatus,
} from '../services/manageDirectoryService'

export function useManageDirectory() {
  const { data, loading, error, reload, setData } = useLoad(fetchManageDirectoryData)
  const [center, setCenter] = useState<EvacuationCenter | null>(null)
  const [hotline, setHotline] = useState<Hotline | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const toggleOpen = async (c: EvacuationCenter) => {
    setBusy(`c${c.id}`)
    try {
      const updated = await updateCenterOpenStatus(c)
      setData((d) => d && { ...d, centers: d.centers.map((x) => (x.id === c.id ? updated : x)) })
      toast.success(`${c.name} is now marked ${updated.open ? 'open' : 'closed'}.`)
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  const removeCenter = async (c: EvacuationCenter) => {
    if (!(await confirmAction({ title: 'Remove this evacuation center?', text: c.name, confirmText: 'Remove', danger: true }))) return
    try {
      await deleteCenterById(c.id)
      setData((d) => d && { ...d, centers: d.centers.filter((x) => x.id !== c.id) })
      toast.success('Evacuation center removed.')
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  const removeHotline = async (h: Hotline) => {
    if (!(await confirmAction({ title: 'Remove this hotline?', text: `${h.agency} · ${h.number}`, confirmText: 'Remove', danger: true }))) return
    try {
      await deleteHotlineById(h.id)
      setData((d) => d && { ...d, hotlines: d.hotlines.filter((x) => x.id !== h.id) })
      toast.success('Hotline removed.')
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  return {
    data,
    loading,
    error,
    reload,
    setData,
    center,
    setCenter,
    hotline,
    setHotline,
    busy,
    toggleOpen,
    removeCenter,
    removeHotline,
  }
}

export function useSaver<T extends { id?: number }>(path: string, onSaved: (v: T) => void) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const save = async (id: number | undefined, body: unknown, okText: string) => {
    setSaving(true)
    try {
      const saved = await saveDirectoryResource<T>(path, id, body)
      toast.success(okText)
      onSaved(saved)
    } catch (err) {
      setErrors(fieldErrors(err))
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }
  return { errors, setErrors, saving, save }
}
