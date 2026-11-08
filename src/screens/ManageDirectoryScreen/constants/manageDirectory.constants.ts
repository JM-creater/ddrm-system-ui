import type { EvacuationCenter, Hotline } from '../../../types'

export const EMPTY_CENTER: EvacuationCenter = {
  name: '',
  location: '',
  puroksServed: '',
  capacity: null,
  contactPerson: '',
  contactNumber: '',
  open: false,
}

export const EMPTY_HOTLINE: Hotline = {
  agency: '',
  number: '',
  description: '',
  sortOrder: 0,
}

export const blank = (s?: string | null) => (s ?? '').trim() || null
