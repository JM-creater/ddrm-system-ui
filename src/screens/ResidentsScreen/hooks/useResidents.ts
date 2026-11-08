import { useState } from 'react'
import { toast } from 'react-toastify'
import { errorMessage } from '../../../api/client'
import { useDebounced, useLoad } from '../../../hooks'
import type { User } from '../../../types'
import { confirmAction } from '../../../utils/dialogs'
import { RESIDENTS_PAGE_SIZE } from '../constants/residents.constants'
import { fetchResidents, updateResidentStatus } from '../services/residentsService'

export function useResidents() {
  const [q, setQ] = useState('')
  const query = useDebounced(q.trim())
  const [page, setPage] = useState(0)
  const [busyId, setBusyId] = useState<number | null>(null)

  const { data, loading, error, reload, setData } = useLoad(
    () => fetchResidents({ q: query || undefined, page, size: RESIDENTS_PAGE_SIZE }),
    [query, page],
  )

  const toggle = async (u: User) => {
    const disabling = u.enabled
    const ok = await confirmAction({
      title: disabling ? `Deactivate ${u.fullName}?` : `Reactivate ${u.fullName}?`,
      text: disabling
        ? 'The resident will not be able to sign in until the account is reactivated. Reports already filed are kept.'
        : 'The resident will be able to sign in again.',
      confirmText: disabling ? 'Deactivate' : 'Reactivate',
      danger: disabling,
    })
    if (!ok) return
    setBusyId(u.id)
    try {
      const updated = await updateResidentStatus(u.id, !disabling)
      setData((d) => d && { ...d, content: d.content.map((x) => (x.id === u.id ? updated : x)) })
      toast.success(disabling ? 'Account deactivated.' : 'Account reactivated.')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return { q, setQ, query, page, setPage, busyId, data, loading, error, reload, toggle }
}
