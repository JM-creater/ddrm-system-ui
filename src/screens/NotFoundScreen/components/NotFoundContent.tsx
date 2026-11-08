import { Link } from 'react-router-dom'
import Logo from '../../../components/Logo/Logo'
import { NOT_FOUND_CODE, NOT_FOUND_HEADING, NOT_FOUND_MESSAGE } from '../constants/notFound.constants'
import type { NotFoundDestination } from '../types/notFound.types'

export default function NotFoundContent({ to, label }: NotFoundDestination) {
  return (
    <div className="notfound">
      <Logo size={64} />
      <div className="code">{NOT_FOUND_CODE}</div>
      <h1 className="h4">{NOT_FOUND_HEADING}</h1>
      <p className="text-muted">{NOT_FOUND_MESSAGE}</p>
      <Link to={to} className="btn btn-primary">
        {label}
      </Link>
    </div>
  )
}
