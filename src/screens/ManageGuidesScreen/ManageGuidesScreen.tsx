import { Plus } from 'lucide-react'
import { Button } from 'react-bootstrap'
import { EmptyState, ErrorState, Loading, PageHeader, Panel } from '../../components/ui/ui'
import GuideEditor from './components/GuideEditor'
import GuidesTable from './components/GuidesTable'
import { EMPTY_GUIDE } from './constants/manageGuides.constants'
import './css/ManageGuidesScreen.css'
import { useManageGuides } from './hooks/useManageGuides'

export default function ManageGuidesScreen() {
  const { data, loading, error, reload, editing, setEditing, remove, onSaved } = useManageGuides()

  return (
    <>
      <PageHeader
        icon="📖"
        title="Preparedness Guides"
        subtitle="Information, education and communication (IEC) material shown to residents."
        actions={
          <Button
            variant="accent"
            size="sm"
            onClick={() => setEditing({ ...EMPTY_GUIDE, sortOrder: (data?.length ?? 0) + 1 })}
          >
            <Plus size={15} className="me-1" />
            New guide
          </Button>
        }
      />
      <Panel bodyClass="">
        {loading && !data ? (
          <Loading />
        ) : error || !data ? (
          <ErrorState message={error ?? 'No data.'} onRetry={reload} />
        ) : data.length === 0 ? (
          <EmptyState title="No guides yet" />
        ) : (
          <GuidesTable guides={data} onEdit={setEditing} onRemove={remove} />
        )}
      </Panel>

      {editing && <GuideEditor guide={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </>
  )
}
