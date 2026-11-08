import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { fileUrl } from '../../api/client'
import type { Media } from '../../types'
import './Lightbox.css'

interface Props {
  items: Media[]
  index: number | null
  onIndex: (i: number | null) => void
}

export default function Lightbox({ items, index, onIndex }: Props) {
  const open = index !== null && items.length > 0
  const current = open ? items[index] : null

  const go = useCallback(
    (delta: number) => {
      if (index === null) return
      onIndex((index + delta + items.length) % items.length)
    },
    [index, items.length, onIndex],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  return (
    <Modal show={open} onHide={() => onIndex(null)} size="xl" centered className="lightbox">
      <Modal.Body>
        <button type="button" className="lb-close" onClick={() => onIndex(null)} aria-label="Close">
          <X size={20} />
        </button>
        {current &&
          (current.kind === 'VIDEO' ? (
            <video key={current.id} src={fileUrl(current.url)} controls autoPlay playsInline />
          ) : (
            <img key={current.id} src={fileUrl(current.url)} alt="Attachment" />
          ))}
        {items.length > 1 && (
          <>
            <button type="button" className="lb-nav prev" onClick={() => go(-1)} aria-label="Previous">
              <ChevronLeft size={22} />
            </button>
            <button type="button" className="lb-nav next" onClick={() => go(1)} aria-label="Next">
              <ChevronRight size={22} />
            </button>
            <span className="lb-count">
              {(index ?? 0) + 1} / {items.length}
            </span>
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}
