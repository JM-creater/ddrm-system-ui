import { Plus } from 'lucide-react'
import { Button } from 'react-bootstrap'
import { EmptyState, ErrorState, Loading, PageHeader, Panel } from '../../components/ui/ui'
import AlertEditor from './components/AlertEditor'
import AlertsTable from './components/AlertsTable'
import { MANAGE_ALERTS_SUBTITLE, MANAGE_ALERTS_TITLE } from './constants/manageAlerts.constants'
import './css/ManageAlertsScreen.css'
import { useManageAlerts } from './hooks/useManageAlerts'

export default function ManageAlertsScreen() {
  const { data, loading, error, reload, editing, setEditing, busyId, toggle, remove, onSaved } = useManageAlerts()

  return (
    <>
      <PageHeader
        icon="📢"
        title={MANAGE_ALERTS_TITLE}
        subtitle={MANAGE_ALERTS_SUBTITLE}
        actions={
          <Button variant="accent" size="sm" onClick={() => setEditing('new')}>
            <Plus size={15} className="me-1" />
            New notice
          </Button>
        }
      />
      <Panel bodyClass="">
        {loading && !data ? (
          <Loading />
        ) : error || !data ? (
          <ErrorState message={error ?? 'No data.'} onRetry={reload} />
        ) : data.length === 0 ? (
          <EmptyState title="No notices posted yet" />
        ) : (
          <AlertsTable alerts={data} busyId={busyId} onToggle={toggle} onEdit={setEditing} onRemove={remove} />
        )}
      </Panel>

      {editing && (
        <AlertEditor
          alert={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </>
  )
}
