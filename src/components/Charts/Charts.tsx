import type { CountItem, DomainScore } from '../../types'
import { readinessColor } from '../../utils/format'
import './Charts.css'

export function HBarChart({ items, color }: { items: CountItem[]; color?: string }) {
  const max = Math.max(1, ...items.map((i) => i.count))
  return (
    <div className="hbars">
      {items.map((i) => (
        <div className="hbar" key={i.key} title={`${i.label}: ${i.count}`}>
          <span className="lab">{i.label}</span>
          <span className="track">
            <span
              className="fill d-block"
              style={{ width: `${(i.count / max) * 100}%`, background: i.count ? color : 'transparent' }}
            />
          </span>
          <span className="num">{i.count}</span>
        </div>
      ))}
    </div>
  )
}

/** Column chart with the count printed at the foot of each bar. */
export function VBarChart({ items, colors }: { items: CountItem[]; colors?: Record<string, string> }) {
  const max = Math.max(1, ...items.map((i) => i.count))
  return (
    <div className="vbars" role="img" aria-label={items.map((i) => `${i.label} ${i.count}`).join(', ')}>
      {items.map((i) => (
        <div className="vbar" key={i.key} title={`${i.label}: ${i.count}`}>
          <div className="col">
            <span className="fill" style={{ height: `${(i.count / max) * 100}%`, background: colors?.[i.key] ?? '#1559a6' }} />
            <span className="num">{i.count}</span>
          </div>
          <div className="lab">{i.label.toLowerCase()}</div>
        </div>
      ))}
    </div>
  )
}

export function StackBar({ items, colors }: { items: CountItem[]; colors: Record<string, string> }) {
  const total = items.reduce((s, i) => s + i.count, 0)
  return (
    <div>
      <div className="stackbar" role="img" aria-label="Reports by status">
        {total > 0 &&
          items
            .filter((i) => i.count > 0)
            .map((i) => (
              <span
                key={i.key}
                style={{ width: `${(i.count / total) * 100}%`, background: colors[i.key] }}
                title={`${i.label}: ${i.count}`}
              />
            ))}
      </div>
      <div className="legend">
        {items.map((i) => (
          <span key={i.key}>
            <i style={{ background: colors[i.key] }} />
            {i.label} <b className="tabular">{i.count}</b>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Donut gauge for a 0-100 percentage. */
export function Gauge({ percent, size = 160, caption }: { percent: number; size?: number; caption?: string }) {
  const r = 50
  const c = 2 * Math.PI * r
  const p = Math.max(0, Math.min(100, percent))
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`${p} percent`} className="donut">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#e8edf5" strokeWidth="11" />
      {p > 0 && (
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={readinessColor(p)}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${(p / 100) * c} ${c}`}
          transform="rotate(-90 60 60)"
        />
      )}
      <text x="60" y={caption ? 62 : 66} textAnchor="middle" className="big" fontSize="17">
        {p}%
      </text>
      {caption && (
        <text x="60" y="78" textAnchor="middle" fontSize="8.5" fill="#6b778a">
          {caption}
        </text>
      )}
    </svg>
  )
}

export function DomainBars({ domains }: { domains: DomainScore[] }) {
  return (
    <div>
      {domains.map((d) => (
        <div className="domain-row" key={d.key} title={`${d.label}: mean ${d.mean.toFixed(2)} (${d.level})`}>
          <span>{d.label}</span>
          <span className="track">
            <span className="fill d-block" style={{ width: `${d.percent}%`, background: readinessColor(d.percent) }} />
          </span>
          <span className="tabular text-end fw-semibold">{d.mean.toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}
