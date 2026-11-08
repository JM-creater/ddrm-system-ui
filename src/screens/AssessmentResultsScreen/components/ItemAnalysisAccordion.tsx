import { Accordion, Table } from 'react-bootstrap'
import { LevelText } from '../../../components/ui/ui'
import { fmtMean } from '../../../utils/format'
import { PART } from '../constants/assessmentResults.constants'
import type { ItemAnalysisAccordionProps } from '../types/assessmentResults.types'

export default function ItemAnalysisAccordion({ domains }: ItemAnalysisAccordionProps) {
  return (
    <Accordion alwaysOpen className="mb-3">
      {domains.map((d) => (
        <Accordion.Item eventKey={d.key} key={d.key}>
          <Accordion.Header>
            <span>
              <span className="hz">
                {PART[d.key] ? `${PART[d.key]}. ` : ''}
                {d.label}
              </span>
              <span className="text-muted small ms-2">
                mean {fmtMean(d.mean)} · {d.level}
              </span>
            </span>
          </Accordion.Header>
          <Accordion.Body className="p-0">
            <div className="table-responsive">
              <Table className="stat-table mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Statement</th>
                    <th className="num">Mean</th>
                    <th>Description</th>
                    <th>Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  {d.items.map((it) => (
                    <tr key={it.itemNo}>
                      <td className="text-muted tabular">{it.itemNo}</td>
                      <td>
                        {it.statement}
                        {it.negative && (
                          <span className="rev-mark" title="Negatively worded; reverse-scored">
                            R
                          </span>
                        )}
                        {it.indicator && <div className="small text-muted">{it.indicator}</div>}
                      </td>
                      <td className="num">{fmtMean(it.mean)}</td>
                      <td>{it.description}</td>
                      <td>
                        <LevelText level={it.level} />
                      </td>
                    </tr>
                  ))}
                  <tr className="fw-semibold">
                    <td />
                    <td>Weighted mean</td>
                    <td className="num">{fmtMean(d.mean)}</td>
                    <td />
                    <td>
                      <LevelText level={d.level} />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
