import { useState } from 'react'
import { toast } from 'react-toastify'
import { errorMessage } from '../../../api/client'
import { useLoad } from '../../../hooks'
import type { Alert } from '../../../types'
import { confirmAction } from '../../../utils/dialogs'
import { deleteAlert, fetchAlerts, toggleAlertActive } from '../services/manageAlertsService'
import type { EditingAlertState } from '../types/manageAlerts.types'

export function useManageAlerts() {
  const { data, loading, error, reload, setData } = useLoad(fetchAlerts)
  const [editing, setEditing] = useState<EditingAlertState>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const replace = (a: Alert) => setData((list) => (list ? list.map((x) => (x.id === a.id ? a : x)) : list))

  const toggle = async (a: Alert) => {
    const lifting = a.active
    const ok = await confirmAction({
      title: lifting ? 'Lift this warning?' : 'Put this warning back in effect?',
      text: lifting
        ? 'Residents will see it as lifted in the bulletin.'
        : 'It will appear again on every resident dashboard.',
      confirmText: lifting ? 'Lift warning' : 'Reactivate',
    })
    if (!ok) return
    setBusyId(a.id)
    try {
      const updated = await toggleAlertActive(a.id, !lifting)
      replace(updated)
      toast.success(lifting ? 'Warning lifted.' : 'Warning is in effect again.')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (a: Alert) => {
    const ok = await confirmAction({
      title: 'Delete this notice?',
      text: `“${a.title}” will be removed permanently. To end a warning but keep a record, lift it instead.`,
      confirmText: 'Delete',
      danger: true,
    })
    if (!ok) return
    setBusyId(a.id)
    try {
      await deleteAlert(a.id)
      setData((list) => (list ? list.filter((x) => x.id !== a.id) : list))
      toast.success('Notice deleted.')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const onSaved = (a: Alert, created: boolean) => {
    setEditing(null)
    if (created) setData((list) => [a, ...(list ?? [])])
    else replace(a)
  }

  return { data, loading, error, reload, editing, setEditing, busyId, toggle, remove, onSaved }
}
