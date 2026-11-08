import NotFoundContent from './components/NotFoundContent'
import './css/NotFoundScreen.css'
import { useNotFound } from './hooks/useNotFound'

export default function NotFoundScreen() {
  const destination = useNotFound()
  return <NotFoundContent {...destination} />
}
