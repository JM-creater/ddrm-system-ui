import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import AlertNotice from '../../components/AlertNotice/AlertNotice'
import { EmptyState, ErrorState, Loading, PageHeader } from '../../components/ui/ui'
import WarningLevelsPanel from './components/WarningLevelsPanel'
import { ALERTS_SUBTITLE, ALERTS_TITLE } from './constants/alerts.constants'
import './css/AlertsScreen.css'
import { useAlerts } from './hooks/useAlerts'

export default function AlertsScreen() {
  const { data, loading, error, reload, view, setView, list } = useAlerts()

  return (
    <>
      <PageHeader
        icon="📢"
        title={ALERTS_TITLE}
        subtitle={ALERTS_SUBTITLE}
        actions={
          <ButtonGroup size="sm">
            <ToggleButton
              id="v-active"
              type="radio"
              variant="outline-primary"
              value="active"
              checked={view === 'active'}
              onChange={() => setView('active')}
            >
              In effect
            </ToggleButton>
            <ToggleButton
              id="v-all"
              type="radio"
              variant="outline-primary"
              value="all"
              checked={view === 'all'}
              onChange={() => setView('all')}
            >
              All notices
            </ToggleButton>
          </ButtonGroup>
        }
      />

      <div className="row g-3">
        <div className="col-lg-8">
          {loading && !data ? (
            <Loading />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : list.length === 0 ? (
            <EmptyState title={view === 'active' ? 'No warning is in effect' : 'No notices have been posted'}>
              {view === 'active' && 'Weather and hazard conditions are normal. Keep your emergency kit ready anyway.'}
            </EmptyState>
          ) : (
            list.map((a) => <AlertNotice key={a.id} alert={a} />)
          )}
        </div>
        <div className="col-lg-4">
          <WarningLevelsPanel />
        </div>
      </div>
    </>
  )
}
