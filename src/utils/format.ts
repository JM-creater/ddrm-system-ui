import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const fmtDate = (v?: string | null) => (v ? dayjs(v).format('MMM D, YYYY') : '—')
export const fmtDateTime = (v?: string | null) => (v ? dayjs(v).format('MMM D, YYYY · h:mm A') : '—')
export const fmtStamp = (v?: string | null) => (v ? dayjs(v).format('MMM D, YYYY, h:mm A') : '')
export const fmtTime = (v?: string | null) => (v ? dayjs(v).format('h:mm A') : '')
export const fromNow = (v?: string | null) => (v ? dayjs(v).fromNow() : '')
export const todayLong = () => dayjs().format('dddd, MMMM D, YYYY')

export function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export const fmtMean = (v?: number | null) => (v === null || v === undefined ? '—' : v.toFixed(2))

export function fmtP(v?: number | null) {
  if (v === null || v === undefined) return '—'
  return v < 0.001 ? '< .001' : v.toFixed(3).replace(/^0/, '')
}

/** Cebuano greeting based on the time of day. */
export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Maayong buntag'
  if (h < 13) return 'Maayong udto'
  if (h < 18) return 'Maayong hapon'
  return 'Maayong gabii'
}

export function initials(name?: string | null) {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')
}

/** Guides store one step per line. */
export const steps = (text?: string | null) =>
  (text ?? '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

/** CSS class for a Likert interpretation such as "Very High". */
export const levelClass = (level?: string | null) =>
  level ? 'lv-' + level.toLowerCase().replace(/\s+/g, '-') : ''

/** Colour used for a 0-100 readiness percentage. */
export function readinessColor(percent: number) {
  if (percent >= 75) return '#2f9e5b'
  if (percent >= 50) return '#7cad3a'
  if (percent >= 25) return '#e59a1f'
  return '#dc3b3b'
}

/** Short wording shown under the readiness donut. */
export function readinessWord(percent: number) {
  if (percent >= 75) return 'Well Prepared'
  if (percent >= 50) return 'Fairly Prepared'
  return 'Needs Improvement'
}
