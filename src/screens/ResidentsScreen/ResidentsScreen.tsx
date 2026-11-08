import { Search } from 'lucide-react'
import { Form } from 'react-bootstrap'
import { EmptyState, ErrorState, Loading, PageHeader, Pager, Panel } from '../../components/ui/ui'
import ResidentsTable from './components/ResidentsTable'
import { RESIDENTS_SUBTITLE, RESIDENTS_TITLE } from './constants/residents.constants'
import './css/ResidentsScreen.css'
import { useResidents } from './hooks/useResidents'

export default function ResidentsScreen() {
  const { q, setQ, query, setPage, busyId, data, loading, error, reload, toggle } = useResidents()

  return (
    <>
      <PageHeader icon="👥" title={RESIDENTS_TITLE} subtitle={RESIDENTS_SUBTITLE} />
      <div className="toolbar">
        <div className="search">
          <Search size={16} />
          <Form.Control
            type="search"
            placeholder="Search name, e-mail or purok"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(0)
            }}
            aria-label="Search residents"
          />
        </div>
      </div>
      <Panel
        bodyClass=""
        footer={data && <Pager page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onChange={setPage} />}
      >
        {loading && !data ? (
          <Loading />
        ) : error || !data ? (
          <ErrorState message={error ?? 'No data.'} onRetry={reload} />
        ) : data.content.length === 0 ? (
          <EmptyState title={query ? 'No resident matches your search' : 'No residents have registered yet'} />
        ) : (
          <ResidentsTable residents={data.content} loading={loading} busyId={busyId} onToggle={toggle} />
        )}
      </Panel>
    </>
  )
}
