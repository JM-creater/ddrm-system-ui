import { Download, Printer } from 'lucide-react'
import { Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import { Gauge } from '../../components/Charts/Charts'
import { EmptyState, ErrorState, LevelText, Loading, PageHeader, Panel, StatCard } from '../../components/ui/ui'
import { fmtMean, fmtP } from '../../utils/format'
import Decision from './components/Decision'
import GroupMeans from './components/GroupMeans'
import ItemAnalysisAccordion from './components/ItemAnalysisAccordion'
import { DOMAIN_ORDER, PART, fmtStat } from './constants/assessmentResults.constants'
import './css/AssessmentResultsScreen.css'
import { useAssessmentResults } from './hooks/useAssessmentResults'

export default function AssessmentResultsScreen() {
  const { data, loading, error, reload, exporting, exportCsv } = useAssessmentResults()

  const header = (
    <PageHeader
      icon="📈"
      title="Preparedness Survey Results"
      subtitle="Knowledge, attitudes and practices on disaster preparedness of Barangay Tabunok residents."
      actions={
        <>
          <Button variant="outline-secondary" size="sm" onClick={() => window.print()} disabled={!data?.respondents}>
            <Printer size={15} className="me-1" />
            Print
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={exportCsv} disabled={exporting || !data?.respondents}>
            {exporting ? <Spinner size="sm" className="me-1" /> : <Download size={15} className="me-1" />}
            Export responses (CSV)
          </Button>
        </>
      }
    />
  )

  if (loading && !data) return <Loading />
  if (error || !data) return <ErrorState message={error ?? 'No data.'} onRetry={reload} />

  if (data.respondents === 0) {
    return (
      <>
        {header}
        <EmptyState title="No responses yet">
          Results appear here once residents answer the preparedness assessment in their portal.
        </EmptyState>
      </>
    )
  }

  const order = (key: string) => DOMAIN_ORDER.indexOf(key)
  const domains = [...data.domains].sort((a, b) => order(a.key) - order(b.key))

  return (
    <>
      {header}

      <Row className="g-3 mb-3">
        <Col md={3}>
          <StatCard label="Respondents" value={data.respondents} note="Residents who answered" />
        </Col>
        {domains.map((d) => (
          <Col md={3} xs={6} key={d.key}>
            <StatCard label={d.label} value={fmtMean(d.mean)} note={<LevelText level={d.level} />} />
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-3">
        <Col lg={5}>
          <Panel title="Overall level of preparedness" className="h-100">
            {data.overall && (
              <div className="gauge">
                <Gauge percent={data.overall.percent} caption="readiness" />
                <div>
                  <div className="text-muted small">Overall weighted mean</div>
                  <div className="fs-3 fw-bold tabular">{fmtMean(data.overall.mean)}</div>
                  <LevelText level={data.overall.level} />
                </div>
              </div>
            )}
            <p className="small text-muted mt-3 mb-0">
              Scale: 3.26–4.00 Very High · 2.51–3.25 High · 1.76–2.50 Low · 1.00–1.75 Very Low. Negatively worded
              statements are reverse-scored before computing the means.
            </p>
          </Panel>
        </Col>
        <Col lg={7}>
          <Panel title="Summary by domain" bodyClass="" className="h-100">
            <Table className="stat-table mb-0">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th className="num">Mean</th>
                  <th className="num">SD</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((d) => (
                  <tr key={d.key}>
                    <td>{d.label}</td>
                    <td className="num">{fmtMean(d.mean)}</td>
                    <td className="num">{fmtMean(d.sd)}</td>
                    <td>
                      <LevelText level={d.level} />
                    </td>
                  </tr>
                ))}
                {data.overall && (
                  <tr className="fw-semibold">
                    <td>Overall</td>
                    <td className="num">{fmtMean(data.overall.mean)}</td>
                    <td className="num" />
                    <td>
                      <LevelText level={data.overall.level} />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Panel>
        </Col>
      </Row>

      <h2 className="h5 mt-4 mb-2">Profile of the respondents</h2>
      <Row className="g-3 mb-3">
        {data.profile.map((t) => (
          <Col md={6} xl={4} key={t.variable}>
            <Panel title={t.variable} bodyClass="" className="h-100">
              <Table size="sm" className="stat-table mb-0">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="num">f</th>
                    <th className="num">%</th>
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r) => (
                    <tr key={r.label}>
                      <td>{r.label}</td>
                      <td className="num">{r.frequency}</td>
                      <td className="num">{r.percent.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="fw-semibold">
                    <td>Total</td>
                    <td className="num">{t.rows.reduce((s, r) => s + r.frequency, 0)}</td>
                    <td className="num">100.00</td>
                  </tr>
                </tbody>
              </Table>
            </Panel>
          </Col>
        ))}
      </Row>

      <h2 className="h5 mt-4 mb-2">Item analysis</h2>
      <ItemAnalysisAccordion domains={domains} />
      <p className="small text-muted">
        <span className="rev-mark ms-0">R</span> reverse-scored item. Means shown are after reverse scoring.
      </p>

      <h2 className="h5 mt-4 mb-2">Relationship among knowledge, attitudes and practices</h2>
      <Panel bodyClass="" className="mb-3" footer={<span className="small text-muted">Pearson product-moment correlation, α = 0.05</span>}>
        <div className="table-responsive">
          <Table className="stat-table mb-0">
            <thead>
              <tr>
                <th>Variables</th>
                <th className="num">r</th>
                <th className="num">p-value</th>
                <th>Strength</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {data.correlations.map((c) => (
                <tr key={c.variables}>
                  <td>{c.variables}</td>
                  <td className="num">{fmtStat(c.r)}</td>
                  <td className="num">{fmtP(c.p)}</td>
                  <td>{c.strength ?? '—'}</td>
                  <td>
                    <Decision text={c.decision} note={c.note} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Panel>

      <h2 className="h5 mt-4 mb-2">Difference in preparedness by profile</h2>
      <Panel
        bodyClass=""
        className="mb-3"
        footer={
          <span className="small text-muted">
            t-test for two groups, one-way ANOVA for three or more, α = 0.05. Dependent variable: overall preparedness mean.
          </span>
        }
      >
        <div className="table-responsive">
          <Table className="stat-table mb-0">
            <thead>
              <tr>
                <th>Profile variable</th>
                <th>Test</th>
                <th className="num">Statistic</th>
                <th className="num">p-value</th>
                <th>Decision</th>
                <th>Group means</th>
              </tr>
            </thead>
            <tbody>
              {data.differences.map((d) => (
                <tr key={d.variable}>
                  <td>{d.variable}</td>
                  <td>{d.test}</td>
                  <td className="num">{fmtStat(d.statistic)}</td>
                  <td className="num">{fmtP(d.p)}</td>
                  <td>
                    <Decision text={d.decision} note={d.note} />
                  </td>
                  <td className="small">
                    <GroupMeans groups={d.groups} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Panel>

      <h2 className="h5 mt-4 mb-2">Gaps to address in the preparedness plan</h2>
      <Panel
        bodyClass=""
        footer={
          <span className="small text-muted">
            Lowest-scoring statements across all domains. These can guide the barangay's IEC and training priorities.
          </span>
        }
      >
        {data.gaps.length === 0 ? (
          <div className="panel-body text-muted">No items to show.</div>
        ) : (
          <div className="table-responsive">
            <Table className="stat-table mb-0">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Statement</th>
                  <th className="num">Mean</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {data.gaps.map((g) => (
                  <tr key={`${g.section}-${g.itemNo}`}>
                    <td className="text-nowrap">
                      {PART[g.section]} #{g.itemNo}
                    </td>
                    <td>
                      {g.statement}
                      {g.negative && <span className="rev-mark">R</span>}
                    </td>
                    <td className="num">{fmtMean(g.mean)}</td>
                    <td>
                      <LevelText level={g.level} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Panel>
    </>
  )
}
