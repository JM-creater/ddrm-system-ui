import { Accordion } from 'react-bootstrap'
import { HAZARD_EMOJI } from '../../../constants'
import type { Guide } from '../../../types'
import { fmtDate, steps } from '../../../utils/format'
import { PHASES } from '../constants/guides.constants'

export default function GuideAccordionList({ guides }: { guides: Guide[] }) {
  return (
    <Accordion alwaysOpen className="guide-list">
      {guides.map((g) => (
        <Accordion.Item eventKey={String(g.id)} key={g.id}>
          <Accordion.Header>
            <span>
              <span className="hz-ico" aria-hidden="true">
                {HAZARD_EMOJI[g.hazard || 'OTHER'] ?? '⚠️'}
              </span>
              <span className="hz">{g.title}</span>
            </span>
          </Accordion.Header>
          <Accordion.Body>
            {g.summary && <p className="mb-3">{g.summary}</p>}
            <div className="guide-cols">
              {PHASES.map((ph) => {
                const list = steps(g[ph.key])
                return (
                  <div className={ph.cls} key={ph.key}>
                    <h4>{ph.title}</h4>
                    {list.length ? (
                      <ol>
                        {list.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-muted small">No steps listed.</p>
                    )}
                  </div>
                )
              })}
            </div>
            {g.updatedAt && <div className="small text-muted mt-3">Updated {fmtDate(g.updatedAt)}</div>}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
