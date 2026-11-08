export type Role = 'RESIDENT' | 'ADMIN'
export type IncidentType = 'FLOOD' | 'TYPHOON' | 'STORM_SURGE' | 'EARTHQUAKE' | 'FIRE' | 'LANDSLIDE' | 'OTHER'
export type Severity = 'LOW' | 'MODERATE' | 'HIGH'
export type IncidentStatus = 'PENDING' | 'VERIFIED' | 'RESPONDING' | 'RESOLVED' | 'REJECTED'
export type AlertLevel = 'ADVISORY' | 'YELLOW' | 'ORANGE' | 'RED'
export type MediaKind = 'PHOTO' | 'VIDEO'
export type SurveySection = 'KNOWLEDGE' | 'ATTITUDE' | 'PRACTICE'

export interface User {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  contactNumber: string | null
  purok: string | null
  address: string | null
  role: Role
  enabled: boolean
  createdAt: string
}

export interface AuthResponse {
  token: string
  expiresIn: number
  user: User
}

export interface ApiErrorBody {
  status: number
  message: string
  errors?: Record<string, string>
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface Option {
  value: string
  label: string
}

export interface CountItem {
  key: string
  label: string
  count: number
}

export interface DomainScore {
  key: string
  label: string
  mean: number
  percent: number
  level: string
}

export interface Media {
  id: number
  kind: MediaKind
  url: string
  contentType: string
}

export interface Incident {
  id: number
  reportNo: string
  type: IncidentType
  typeLabel: string
  severity: Severity
  severityLabel: string
  purok: string
  description: string
  exactLocation: string | null
  latitude: number | null
  longitude: number | null
  status: IncidentStatus
  statusLabel: string
  remarks: string | null
  reporterId: number
  reporterName: string
  reporterContact: string | null
  reviewedByName: string | null
  media: Media[]
  createdAt: string
  updatedAt: string
  canDelete: boolean
}

export interface Alert {
  id: number
  title: string
  message: string
  level: AlertLevel
  levelLabel: string
  hazard: IncidentType | null
  hazardLabel: string | null
  affectedArea: string | null
  active: boolean
  postedBy: string | null
  createdAt: string
  liftedAt: string | null
}

export interface AlertForm {
  title: string
  message: string
  level: AlertLevel | ''
  hazard: IncidentType | ''
  affectedArea: string
}

export interface Guide {
  id?: number
  hazard: IncidentType | ''
  hazardLabel?: string
  title: string
  summary: string
  beforeSteps: string
  duringSteps: string
  afterSteps: string
  sortOrder: number
  updatedAt?: string
}

export interface EvacuationCenter {
  id?: number
  name: string
  location: string
  puroksServed: string
  capacity: number | null
  contactPerson: string
  contactNumber: string
  open: boolean
}

export interface Hotline {
  id?: number
  agency: string
  number: string
  description: string
  sortOrder: number
}

export interface PublicInfo {
  activeAlerts: Alert[]
  hotlines: Hotline[]
  puroks: string[]
}

export interface SurveyQuestion {
  id: number
  section: SurveySection
  sectionLabel: string
  itemNo: number
  statement: string
  indicator: string | null
}

export interface SurveyForm {
  questions: SurveyQuestion[]
  profileOptions: Record<string, Option[]>
  scale: Option[]
}

export interface MySurvey {
  submitted: boolean
  submittedAt: string | null
  profile: Record<string, string> | null
  answers: Record<string, number> | null
  domains: DomainScore[] | null
  overall: DomainScore | null
  focusAreas: string[] | null
}

export interface ProfileRow {
  label: string
  frequency: number
  percent: number
}

export interface ProfileTable {
  variable: string
  rows: ProfileRow[]
}

export interface ItemResult {
  section: SurveySection
  itemNo: number
  statement: string
  indicator: string | null
  negative: boolean
  mean: number
  description: string
  level: string
}

export interface DomainResult {
  key: string
  label: string
  mean: number
  sd: number
  level: string
  items: ItemResult[]
}

export interface CorrelationResult {
  variables: string
  r: number | null
  p: number | null
  strength: string | null
  decision: string | null
  note: string | null
}

export interface GroupMean {
  label: string
  n: number
  mean: number
}

export interface DifferenceResult {
  variable: string
  test: string
  statistic: number | null
  p: number | null
  decision: string | null
  note: string | null
  groups: GroupMean[]
}

export interface SurveyAnalytics {
  respondents: number
  profile: ProfileTable[]
  domains: DomainResult[]
  overall: DomainScore | null
  correlations: CorrelationResult[]
  differences: DifferenceResult[]
  gaps: ItemResult[]
}

export interface QuizQuestion {
  id: number
  question: string
  options: Option[]
}

export interface QuizAttempt {
  id: number
  score: number
  total: number
  percent: number
  takenAt: string
}

export interface QuizResultItem {
  questionId: number
  question: string
  selected: string
  correct: string
  correctText: string
  correctAnswer: boolean
  explanation: string | null
}

export interface QuizResult {
  attemptId: number
  score: number
  total: number
  percent: number
  rating: string
  takenAt: string
  items: QuizResultItem[]
}

export interface ResidentDashboard {
  activeAlerts: Alert[]
  reportsToday: number
  pendingReview: number
  myReportCount: number
  openEvacuationCenters: number
  latestQuiz: QuizAttempt | null
  readiness: DomainScore | null
  readinessDomains: DomainScore[]
  reportsByType: CountItem[]
  myRecentReports: Incident[]
}

export interface AdminDashboard {
  residents: number
  totalIncidents: number
  reportsToday: number
  pending: number
  activeAlerts: number
  respondents: number
  averageReadiness: DomainScore | null
  byType: CountItem[]
  byStatus: CountItem[]
  byPurok: CountItem[]
  pendingQueue: Incident[]
}
