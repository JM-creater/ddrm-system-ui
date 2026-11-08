import { useState } from 'react'
import { toast } from 'react-toastify'
import { errorMessage } from '../../../api/client'
import { useLoad } from '../../../hooks'
import type { Guide } from '../../../types'
import { confirmAction } from '../../../utils/dialogs'
import { sortGuides } from '../constants/manageGuides.constants'
import { deleteGuide, fetchGuides } from '../services/manageGuidesService'

export function useManageGuides() {
  const { data, loading, error, reload, setData } = useLoad(fetchGuides)
  const [editing, setEditing] = useState<Guide | null>(null)

  const remove = async (g: Guide) => {
    const ok = await confirmAction({
      title: 'Delete this guide?',
      text: `“${g.title}” will no longer be visible to residents.`,
      confirmText: 'Delete',
      danger: true,
    })
    if (!ok) return
    try {
      await deleteGuide(g.id)
      setData((list) => (list ? list.filter((x) => x.id !== g.id) : list))
      toast.success('Guide deleted.')
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  const onSaved = (g: Guide) => {
    setEditing(null)
    setData((list) => sortGuides([...(list ?? []).filter((x) => x.id !== g.id), g]))
  }

  return { data, loading, error, reload, editing, setEditing, remove, onSaved }
}
