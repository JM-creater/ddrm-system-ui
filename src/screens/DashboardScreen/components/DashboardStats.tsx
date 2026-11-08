import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { StatCard } from '../../../components/ui/ui'
import { fromNow } from '../../../utils/format'
import type { DashboardStatsProps } from '../types/dashboard.types'

export default function DashboardStats({ data }: DashboardStatsProps) {
  const quiz = data.latestQuiz
  return (
    <Row className="g-3 mb-3">
      <Col xs={6} lg={3}>
        <StatCard label="Active Alerts" value={data.activeAlerts.length} note={<Link to="/alerts">From barangay DRRM</Link>} />
      </Col>
      <Col xs={6} lg={3}>
        <StatCard label="Reports Today" value={data.reportsToday} tone="yellow" note="Community-submitted" />
      </Col>
      <Col xs={6} lg={3}>
        <StatCard label="Pending Review" value={data.pendingReview} tone="red" note="Awaiting verification" />
      </Col>
      <Col xs={6} lg={3}>
        <StatCard
          label="My Knowledge Score"
          value={quiz ? `${quiz.percent}%` : '0%'}
          tone="green"
          note={quiz ? `${quiz.score} of ${quiz.total} · ${fromNow(quiz.takenAt)}` : <Link to="/quiz">Take the Knowledge Test</Link>}
        />
      </Col>
    </Row>
  )
}
