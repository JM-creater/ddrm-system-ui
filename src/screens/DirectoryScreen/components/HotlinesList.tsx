import { Phone } from 'lucide-react'
import { Panel } from '../../../components/ui/ui'
import type { Hotline } from '../../../types'

export default function HotlinesList({ hotlines }: { hotlines: Hotline[] }) {
  return (
    <Panel title="Emergency hotlines" bodyClass="">
      {hotlines.length === 0 ? (
        <div className="panel-body text-muted">No hotlines listed.</div>
      ) : (
        <ul className="dir-hotlines">
          {hotlines.map((h) => (
            <li key={h.id}>
              <div>
                <div className="ag">{h.agency}</div>
                {h.description && <div className="small text-muted">{h.description}</div>}
              </div>
              <a className="tel">
                <Phone size={14} className="me-1" />
                {h.number}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
