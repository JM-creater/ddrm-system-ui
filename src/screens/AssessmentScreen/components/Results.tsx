import { RotateCcw } from 'lucide-react'
import { Fragment } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { DomainBars, Gauge } from '../../../components/Charts/Charts'
import { LevelText, PageHeader, Panel } from '../../../components/ui/ui'
import type { MySurvey, SurveyForm } from '../../../types'
import { fmtDateTime } from '../../../utils/format'
import { INTERPRETATION, PROFILE_FIELDS } from '../constants/assessment.constants'

interface Props {
  form: SurveyForm
  mine: MySurvey
  onRetake: () => void
}

export default function Results({ form, mine, onRetake }: Props) {
  const overall = mine.overall
  const label = (key: string) => {
    const v = mine.profile?.[key]
    return form.profileOptions[key]?.find((o) => o.value === v)?.label ?? '—'
  }

  return (
    <>
      <PageHeader
        icon="🗳️"
        title="My Preparedness Survey"
        subtitle={`Last answered ${fmtDateTime(mine.submittedAt)}`}
        actions={
          <Button variant="outline-primary" size="sm" onClick={onRetake}>
            <RotateCcw size={15} className="me-1" />
            Answer again
          </Button>
        }
      />
      <Row className="g-3">
        <Col lg={7}>
          <Panel title="Result" className="h-100">
            {overall && (
              <div className="gauge mb-3">
                <Gauge percent={overall.percent} caption="readiness" />
                <div>
                  <div className="text-muted small">Overall weighted mean</div>
                  <div className="fs-3 fw-bold tabular">{overall.mean.toFixed(2)}</div>
                  <div>
                    Level of preparedness: <LevelText level={overall.level} />
                  </div>
                </div>
              </div>
            )}
            <Table size="sm" className="stat-table mb-3">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th className="num">Mean</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {(mine.domains ?? []).map((d) => (
                  <tr key={d.key}>
                    <td>{d.label}</td>
                    <td className="num">{d.mean.toFixed(2)}</td>
                    <td>
                      <LevelText level={d.level} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <DomainBars domains={mine.domains ?? []} />
            <p className="small text-muted mt-2 mb-0">
              Negatively worded statements are reverse-scored, so a higher mean always means better preparedness.
            </p>
          </Panel>
        </Col>
        <Col lg={5}>
          <Panel title="How to read the score" className="mb-3">
            <Table size="sm" className="stat-table mb-0">
              <thead>
                <tr>
                  <th>Mean range</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {INTERPRETATION.map(([range, lvl]) => (
                  <tr key={lvl}>
                    <td className="tabular">{range}</td>
                    <td>
                      <LevelText level={lvl} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Panel>
          <Panel title="My profile">
            <dl className="row small mb-0">
              {PROFILE_FIELDS.map((f) => (
                <Fragment key={f.key}>
                  <dt className="col-7 fw-normal text-muted">{f.label}</dt>
                  <dd className="col-5 mb-1">{label(f.key)}</dd>
                </Fragment>
              ))}
            </dl>
          </Panel>
        </Col>
      </Row>

      <Panel title="Things to work on" className="mt-3">
        {mine.focusAreas && mine.focusAreas.length > 0 ? (
          <>
            <p className="small text-muted">
              Your answers to these statements show room for improvement. The <Link to="/guides">preparedness guides</Link>{' '}
              cover most of them.
            </p>
            <ul className="mb-0">
              {mine.focusAreas.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mb-0">Your answers show good preparedness in every statement. Keep it up and share what you know with your household.</p>
        )}
      </Panel>
    </>
  )
}
