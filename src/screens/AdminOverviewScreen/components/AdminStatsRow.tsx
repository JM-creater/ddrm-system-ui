import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { StatCard } from '../../../components/ui/ui'
import type { AdminStatsRowProps } from '../types/adminOverview.types'

export default function AdminStatsRow({ data }: AdminStatsRowProps) {
  return (
    <Row className="g-3 mb-3">
      <Col xs={6} md={4} xl={2}>
        <StatCard
          label="Awaiting review"
          value={data.pending}
          tone={data.pending ? 'yellow' : undefined}
          note={<Link to="/admin/incidents?status=PENDING">Open queue</Link>}
        />
      </Col>
      <Col xs={6} md={4} xl={2}>
        <StatCard label="Reports today" value={data.reportsToday} />
      </Col>
      <Col xs={6} md={4} xl={2}>
        <StatCard label="All reports" value={data.totalIncidents} />
      </Col>
      <Col xs={6} md={4} xl={2}>
        <StatCard label="Warnings in effect" value={data.activeAlerts} tone={data.activeAlerts ? 'orange' : undefined} />
      </Col>
      <Col xs={6} md={4} xl={2}>
        <StatCard label="Registered residents" value={data.residents} note={<Link to="/admin/residents">Manage</Link>} />
      </Col>
      <Col xs={6} md={4} xl={2}>
        <StatCard label="KAP respondents" value={data.respondents} tone="green" note={<Link to="/admin/assessment">Results</Link>} />
      </Col>
    </Row>
  )
}
