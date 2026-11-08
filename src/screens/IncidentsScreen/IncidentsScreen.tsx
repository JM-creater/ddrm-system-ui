import { Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IncidentCard from '../../components/IncidentCard/IncidentCard'
import IncidentDetailModal from '../../components/IncidentDetailModal/IncidentDetailModal'
import { EmptyState, ErrorState, Loading, PageHeader, Pager } from '../../components/ui/ui'
import IncidentFilters from './components/IncidentFilters'
import './css/IncidentsScreen.css'
import { useIncidents } from './hooks/useIncidents'

export default function IncidentsScreen() {
  const {
    type,
    status,
    mine,
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
  } = useIncidents()

  return (
    <>
      <PageHeader
        icon="📋"
        title="Incident Reports"
        subtitle="Community-submitted reports with photos & videos"
        actions={
          <>
            <button
              type="button"
              className={`btn btn-sm ${mine ? 'btn-primary' : 'btn-outline-primary'}`}
              aria-pressed={mine}
              onClick={() => update({ mine: mine ? '' : '1' })}
            >
              👤 My reports
            </button>
            <Button variant="outline-primary" size="sm" onClick={exportCsv} disabled={exporting}>
              {exporting ? <Spinner size="sm" className="me-1" /> : '⬇ '}
              Export Data
            </Button>
          </>
        }
      />

      <IncidentFilters q={q} type={type} status={status} onSearch={onSearch} onUpdate={update} />

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.content.length === 0 ? (
        <EmptyState title={filtered ? 'No report matches your filters' : 'No incident reports yet'}>
          {filtered ? (
            <button type="button" className="btn btn-link p-0" onClick={clearFilters}>
              Clear filters
            </button>
          ) : (
            <Link to="/report">Be the first to report a hazard</Link>
          )}
        </EmptyState>
      ) : (
        <>
          <div className="report-grid" style={{ opacity: loading ? 0.6 : 1 }}>
            {data.content.map((i) => (
              <IncidentCard key={i.id} incident={i} onOpen={setOpen} />
            ))}
          </div>
          <div className="mt-3">
            <Pager
              page={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              onChange={(p) => update({ page: p ? String(p) : '' }, false)}
            />
          </div>
        </>
      )}

      <IncidentDetailModal incident={open} onClose={() => setOpen(null)} onChanged={onChanged} />
    </>
  )
}
