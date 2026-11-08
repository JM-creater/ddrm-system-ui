import { Download } from 'lucide-react'
import { Button, Spinner } from 'react-bootstrap'
import IncidentDetailModal from '../../components/IncidentDetailModal/IncidentDetailModal'
import { EmptyState, ErrorState, Loading, PageHeader, Pager, Panel } from '../../components/ui/ui'
import ManageIncidentsTable from './components/ManageIncidentsTable'
import ManageIncidentsToolbar from './components/ManageIncidentsToolbar'
import './css/ManageIncidentsScreen.css'
import { useManageIncidents } from './hooks/useManageIncidents'

export default function ManageIncidentsScreen() {
  const {
    type,
    status,
    purok,
    puroks,
    q,
    open,
    setOpen,
    exporting,
    data,
    loading,
    error,
    reload,
    update,
    onSearch,
    clearFilters,
    exportCsv,
    onChanged,
    filtered,
  } = useManageIncidents()

  return (
    <>
      <PageHeader
        icon="📋"
        title="Incident Reports"
        subtitle="Review reports from residents, verify them, and record the barangay's response."
        actions={
          <Button variant="outline-secondary" size="sm" onClick={exportCsv} disabled={exporting}>
            {exporting ? <Spinner size="sm" className="me-1" /> : <Download size={15} className="me-1" />}
            Export CSV
          </Button>
        }
      />

      <ManageIncidentsToolbar
        q={q}
        status={status}
        type={type}
        purok={purok}
        puroks={puroks}
        filtered={filtered}
        onSearch={onSearch}
        onUpdate={update}
        onClear={clearFilters}
      />

      <Panel
        bodyClass=""
        footer={
          data && (
            <Pager
              page={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              onChange={(p) => update({ page: p ? String(p) : '' }, false)}
            />
          )
        }
      >
        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !data || data.content.length === 0 ? (
          <EmptyState title={filtered ? 'No report matches the filters' : 'No reports yet'} />
        ) : (
          <ManageIncidentsTable items={data.content} loading={loading} onSelect={setOpen} />
        )}
      </Panel>

      <IncidentDetailModal admin incident={open} onClose={() => setOpen(null)} onChanged={onChanged} />
    </>
  )
}
