import { Col, Form, Row } from 'react-bootstrap'
import { PageHeader } from '../../components/ui/ui'
import IncidentDetailsForm from './components/IncidentDetailsForm'
import MediaAttachmentsPanel from './components/MediaAttachmentsPanel'
import './css/ReportIncidentScreen.css'
import { useReportIncident } from './hooks/useReportIncident'

export default function ReportIncidentScreen() {
  const state = useReportIncident()

  return (
    <>
      <PageHeader icon="🚨" title="Report an Incident" subtitle="Send photos and videos of hazards in Tabunok" />
      <Form onSubmit={state.submit} noValidate>
        <Row className="g-3">
          <Col lg={6}>
            <IncidentDetailsForm
              type={state.type}
              setType={state.setType}
              severity={state.severity}
              setSeverity={state.setSeverity}
              purok={state.purok}
              setPurok={state.setPurok}
              purokOptions={state.purokOptions}
              description={state.description}
              setDescription={state.setDescription}
              exactLocation={state.exactLocation}
              setExactLocation={state.setExactLocation}
              coords={state.coords}
              setCoords={state.setCoords}
              locating={state.locating}
              locate={state.locate}
              submitting={state.submitting}
              preparing={state.preparing}
              progress={state.progress}
              errors={state.errors}
              clearError={state.clearError}
            />
          </Col>

          <Col lg={6}>
            <MediaAttachmentsPanel
              photos={state.photos}
              addPhotos={state.addPhotos}
              removePhoto={state.removePhoto}
              video={state.video}
              setVideo={state.setVideo}
              pickVideo={state.pickVideo}
              preparing={state.preparing}
              errors={state.errors}
              photoInput={state.photoInput}
              videoInput={state.videoInput}
            />
          </Col>
        </Row>
      </Form>
    </>
  )
}
