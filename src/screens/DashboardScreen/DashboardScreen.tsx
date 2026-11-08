import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AlertNotice from '../../components/AlertNotice/AlertNotice'
import { VBarChart } from '../../components/Charts/Charts'
import IncidentDetailModal from '../../components/IncidentDetailModal/IncidentDetailModal'
import { ErrorState, Loading, PageHeader, Panel } from '../../components/ui/ui'
import { TYPE_CHART_COLORS } from '../../constants'
import { readinessWord } from '../../utils/format'
import DashboardStats from './components/DashboardStats'
import PreparednessPanel from './components/PreparednessPanel'
import RecentReportsPanel from './components/RecentReportsPanel'
import { DASHBOARD_SUBTITLE, DASHBOARD_TITLE } from './constants/dashboard.constants'
import './css/DashboardScreen.css'
import { useDashboard } from './hooks/useDashboard'

export default function DashboardScreen() {
  const { user, data, loading, error, reload, open, setOpen } = useDashboard()

  if (loading && !data) return <Loading />
  if (error || !data) return <ErrorState message={error ?? 'No data.'} onRetry={reload} />

  const readiness = data.readiness?.percent ?? 0
  const word = readinessWord(readiness)

  return (
    <>
      <PageHeader
        icon="📊"
        title={DASHBOARD_TITLE}
        subtitle={DASHBOARD_SUBTITLE}
        actions={
          <span className="whoami">
            <span aria-hidden="true">👤</span> {user?.fullName}
            {user?.purok ? ` · ${user.purok}` : ''}
          </span>
        }
      />

      {data.activeAlerts.map((a) => (
        <AlertNotice key={a.id} alert={a} compact />
      ))}

      <DashboardStats data={data} />

      <Row className="g-3 mb-3">
        <Col lg={6}>
          <Panel title="📈 Reports by Hazard Type" className="h-100">
            <VBarChart items={data.reportsByType} colors={TYPE_CHART_COLORS} />
          </Panel>
        </Col>
        <Col lg={6}>
          <PreparednessPanel data={data} readiness={readiness} word={word} />
        </Col>
      </Row>

      <RecentReportsPanel reports={data.myRecentReports} totalCount={data.myReportCount} onSelect={setOpen} />

      {data.openEvacuationCenters > 0 && (
        <p className="small text-muted mt-3">
          🏠 {data.openEvacuationCenters} evacuation center{data.openEvacuationCenters > 1 ? 's are' : ' is'} open right now.{' '}
          <Link to="/directory">See locations</Link>
        </p>
      )}

      <IncidentDetailModal
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
