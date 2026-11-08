import type { ReactNode } from 'react'
import { Pagination, Spinner } from 'react-bootstrap'
import type { IncidentStatus, Severity } from '../../types'
import { levelClass } from '../../utils/format'
import './ui.css'

export function PageHeader({
  title,
  subtitle,
  actions,
  icon,
}: {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
  icon?: string
}) {
  return (
    <div className="page-head">
      <div>
        <h1>
          {icon && (
            <span className="ico" aria-hidden="true">
              {icon}
            </span>
          )}
          {title}
        </h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  )
}

interface StatProps {
  label: string
  value: ReactNode
  note?: ReactNode
  tone?: 'blue' | 'red' | 'orange' | 'yellow' | 'green'
}

export function StatCard({ label, value, note, tone = 'blue' }: StatProps) {
  return (
    <div className={`stat tone-${tone}`}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {note && <div className="note">{note}</div>}
    </div>
  )
}

export function Panel({
  title,
  actions,
  children,
  footer,
  bodyClass = 'panel-body',
  className = '',
}: {
  title?: ReactNode
  actions?: ReactNode
  children: ReactNode
  footer?: ReactNode
  bodyClass?: string
  className?: string
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || actions) && (
        <div className="panel-head">
          {typeof title === 'string' ? <h2>{title}</h2> : title}
          {actions}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
      {footer && <div className="panel-foot">{footer}</div>}
    </section>
  )
}

export function Loading({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="loading" role="status">
      <Spinner animation="border" size="sm" />
      <span>{text}</span>
    </div>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <div className="t">{title}</div>
      {children && <div>{children}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="empty">
      <div className="t">Could not load this page</div>
      <div className="mb-2">{message}</div>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function StatusTag({ status, label }: { status: IncidentStatus; label: string }) {
  return <span className={`tag st-${status}`}>{label}</span>
}

export function SeverityTag({ severity, label }: { severity: Severity; label: string }) {
  return <span className={`sev sev-${severity}`}>{label}</span>
}

export function LevelText({ level }: { level?: string | null }) {
  if (!level) return <span className="text-muted">—</span>
  return <span className={`fw-bold ${levelClass(level)}`}>{level}</span>
}

export function Pager({
  page,
  totalPages,
  totalElements,
  onChange,
}: {
  page: number
  totalPages: number
  totalElements?: number
  onChange: (p: number) => void
}) {
  if (totalPages <= 1) {
    return totalElements !== undefined ? (
      <div className="small text-muted">
        {totalElements} record{totalElements === 1 ? '' : 's'}
      </div>
    ) : null
  }
  const pages: number[] = []
  const start = Math.max(0, Math.min(page - 2, totalPages - 5))
  for (let i = start; i < Math.min(totalPages, start + 5); i++) pages.push(i)
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div className="small text-muted">
        Page {page + 1} of {totalPages}
        {totalElements !== undefined && ` · ${totalElements} records`}
      </div>
      <Pagination size="sm">
        <Pagination.Prev disabled={page === 0} onClick={() => onChange(page - 1)} />
        {pages.map((p) => (
          <Pagination.Item key={p} active={p === page} onClick={() => onChange(p)}>
            {p + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)} />
      </Pagination>
    </div>
  )
}
