import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { HBarChart, StackBar } from '../../components/Charts/Charts'
import IncidentDetailModal from '../../components/IncidentDetailModal/IncidentDetailModal'
import { ErrorState, Loading, PageHeader, Panel } from '../../components/ui/ui'
import { STATUS_COLORS } from '../../constants'
import { todayLong } from '../../utils/format'
import AdminStatsRow from './components/AdminStatsRow'
import CommunityReadinessPanel from './components/CommunityReadinessPanel'
import PendingQueuePanel from './components/PendingQueuePanel'
import { ADMIN_OVERVIEW_TITLE, PUROK_BAR_COLOR } from './constants/adminOverview.constants'
import './css/AdminOverviewScreen.css'
import { useAdminOverview } from './hooks/useAdminOverview'

export default function AdminOverviewScreen() {
  const { data, loading, error, reload, open, setOpen } = useAdminOverview()

  if (loading && !data) return <Loading />
  if (error || !data) return <ErrorState message={error ?? 'No data.'} onRetry={reload} />

  return (
    <>
      <PageHeader
        icon="📊"
        title={ADMIN_OVERVIEW_TITLE}
        subtitle={todayLong()}
        actions={
          <>
            <Link to="/admin/alerts" className="btn btn-sm btn-accent">
              Issue a warning
            </Link>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={reload} disabled={loading}>
              Refresh
            </button>
          </>
        }
      />

      <AdminStatsRow data={data} />

      <Row className="g-3 mb-3">
        <Col lg={7}>
          <PendingQueuePanel pendingQueue={data.pendingQueue} onSelect={setOpen} />
        </Col>
        <Col lg={5}>
          <CommunityReadinessPanel data={data} />
        </Col>
      </Row>

      <Panel title="Reports by status" className="mb-3">
        <StackBar items={data.byStatus} colors={STATUS_COLORS} />
      </Panel>

      <Row className="g-3">
        <Col lg={6}>
          <Panel title="Reports by hazard type" className="h-100">
            <HBarChart items={data.byType} />
          </Panel>
        </Col>
        <Col lg={6}>
          <Panel title="Reports by purok" className="h-100">
            {data.byPurok.length ? (
              <HBarChart items={data.byPurok} color={PUROK_BAR_COLOR} />
            ) : (
              <p className="text-muted mb-0">No reports yet.</p>
            )}
          </Panel>
        </Col>
      </Row>

      <IncidentDetailModal
        admin
        incident={open}
        onClose={() => setOpen(null)}
        onChanged={() => {
          setOpen(null)
          reload()
        }}
      />
    </>
  )
}
