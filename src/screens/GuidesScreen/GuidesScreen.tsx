import { EmptyState, ErrorState, Loading, PageHeader } from '../../components/ui/ui'
import GuideAccordionList from './components/GuideAccordionList'
import { GUIDES_SUBTITLE, GUIDES_TITLE } from './constants/guides.constants'
import './css/GuidesScreen.css'
import { useGuides } from './hooks/useGuides'

export default function GuidesScreen() {
  const { data, loading, error, reload } = useGuides()

  return (
    <>
      <PageHeader
        icon="📖"
        title={GUIDES_TITLE}
        subtitle={GUIDES_SUBTITLE}
        actions={
          <button type="button" className="btn btn-sm btn-outline-primary no-print" onClick={() => window.print()}>
            🖨 Print
          </button>
        }
      />
      {loading && !data ? (
        <Loading />
      ) : error || !data ? (
        <ErrorState message={error ?? 'No data.'} onRetry={reload} />
      ) : data.length === 0 ? (
        <EmptyState title="No guides published yet" />
      ) : (
        <GuideAccordionList guides={data} />
      )}
    </>
  )
}
