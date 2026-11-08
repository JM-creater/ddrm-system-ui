import type { AlertLevel, IncidentStatus, IncidentType, Severity } from '../types'

export const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: 'FLOOD', label: 'Flood' },
  { value: 'TYPHOON', label: 'Typhoon' },
  { value: 'STORM_SURGE', label: 'Storm surge' },
  { value: 'EARTHQUAKE', label: 'Earthquake' },
  { value: 'FIRE', label: 'Fire' },
  { value: 'LANDSLIDE', label: 'Landslide' },
  { value: 'OTHER', label: 'Other hazard' },
]

export const SEVERITIES: { value: Severity; label: string; hint: string }[] = [
  { value: 'LOW', label: 'Low', hint: 'No one hurt, little damage' },
  { value: 'MODERATE', label: 'Moderate', hint: 'Damage to property, area needs checking' },
  { value: 'HIGH', label: 'High / Critical', hint: 'Lives at risk, needs response now' },
]

export const STATUSES: { value: IncidentStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'RESPONDING', label: 'Responding' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'REJECTED', label: 'Rejected' },
]

export const ALERT_LEVELS: { value: AlertLevel; label: string; meaning: string }[] = [
  { value: 'ADVISORY', label: 'Advisory', meaning: 'For information. Keep monitoring.' },
  { value: 'YELLOW', label: 'Yellow warning', meaning: 'Hazard is possible. Be prepared.' },
  { value: 'ORANGE', label: 'Orange warning', meaning: 'Hazard is threatening. Be ready to evacuate.' },
  { value: 'RED', label: 'Red warning', meaning: 'Hazard is severe. Evacuate when told.' },
]

export const MAX_PHOTOS = 3
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024
export const PHONE_PATTERN = /^(09|\+639)\d{9}$/

export const STATUS_COLORS: Record<string, string> = {
  PENDING: '#e0a526',
  VERIFIED: '#1d5fa8',
  RESPONDING: '#e8781e',
  RESOLVED: '#2f9e5b',
  REJECTED: '#a0aab6',
}

/** Banner colour of an incident card that has no photo. */
export const TYPE_COLORS: Record<string, string> = {
  FLOOD: '#1565c0',
  TYPHOON: '#37474f',
  STORM_SURGE: '#00838f',
  EARTHQUAKE: '#6d4c41',
  FIRE: '#e65100',
  LANDSLIDE: '#7a6a2e',
  OTHER: '#546e7a',
}

/** Bar colours of the "Reports by Hazard Type" chart. */
export const TYPE_CHART_COLORS: Record<string, string> = {
  FLOOD: '#1559a6',
  TYPHOON: '#6a4fd6',
  STORM_SURGE: '#0e8fa3',
  EARTHQUAKE: '#8d6e63',
  FIRE: '#dc3b3b',
  LANDSLIDE: '#8a9a2b',
  OTHER: '#78909c',
}

export const HAZARD_EMOJI: Record<string, string> = {
  FLOOD: '🌊',
  TYPHOON: '🌀',
  STORM_SURGE: '🌊',
  EARTHQUAKE: '🏚️',
  FIRE: '🔥',
  LANDSLIDE: '⛰️',
  OTHER: '⚠️',
}
