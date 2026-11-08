import { fmtMean } from '../../../utils/format'
import type { GroupMeansProps } from '../types/assessmentResults.types'

export default function GroupMeans({ groups }: GroupMeansProps) {
  if (!groups.length) return <span className="text-muted">—</span>
  return (
    <>
      {groups.map((g) => (
        <div key={g.label} className="text-nowrap">
          {g.label}: <span className="tabular fw-semibold">{fmtMean(g.mean)}</span> <span className="text-muted">(n={g.n})</span>
        </div>
      ))}
    </>
  )
}
