import { Col, Row } from 'react-bootstrap'
import { EmptyState, ErrorState, Loading, PageHeader } from '../../components/ui/ui'
import EvacuationCenterCard from './components/EvacuationCenterCard'
import HotlinesList from './components/HotlinesList'
import { DIRECTORY_SUBTITLE, DIRECTORY_TITLE } from './constants/directory.constants'
import './css/DirectoryScreen.css'
import { useDirectory } from './hooks/useDirectory'

export default function DirectoryScreen() {
  const { data, loading, error, reload } = useDirectory()

  if (loading && !data) return <Loading />
  if (error || !data) return <ErrorState message={error ?? 'No data.'} onRetry={reload} />

  const openCount = data.centers.filter((c) => c.open).length

  return (
    <>
      <PageHeader icon="🏠" title={DIRECTORY_TITLE} subtitle={DIRECTORY_SUBTITLE} />
      <Row className="g-3">
        <Col lg={8}>
          <h2 className="h5 mb-2">
            Evacuation centers{' '}
            <span className="text-muted fw-normal small">
              {openCount} of {data.centers.length} open
            </span>
          </h2>
          {data.centers.length === 0 ? (
            <EmptyState title="No evacuation centers listed yet" />
          ) : (
            <Row className="g-2">
              {data.centers.map((c) => (
                <Col md={6} key={c.id}>
                  <EvacuationCenterCard center={c} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
        <Col lg={4}>
          <HotlinesList hotlines={data.hotlines} />
        </Col>
      </Row>
    </>
  )
}
