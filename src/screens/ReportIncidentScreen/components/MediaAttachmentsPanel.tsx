import { Trash2, X } from 'lucide-react'
import type { RefObject } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { Panel } from '../../../components/ui/ui'
import { MAX_PHOTOS, MAX_VIDEO_BYTES } from '../../../constants'
import { fmtBytes } from '../../../utils/format'
import { PHOTO_TYPES, VIDEO_TYPES } from '../constants/reportIncident.constants'
import type { PhotoItem } from '../types/reportIncident.types'

interface Props {
  photos: PhotoItem[]
  addPhotos: (files: FileList | null) => Promise<void>
  removePhoto: (idx: number) => void
  video: File | null
  setVideo: (f: File | null) => void
  pickVideo: (files: FileList | null) => void
  preparing: boolean
  errors: Record<string, string>
  photoInput: RefObject<HTMLInputElement | null>
  videoInput: RefObject<HTMLInputElement | null>
}

export default function MediaAttachmentsPanel({
  photos,
  addPhotos,
  removePhoto,
  video,
  setVideo,
  pickVideo,
  preparing,
  errors,
  photoInput,
  videoInput,
}: Props) {
  return (
    <>
      <Panel title={`📷 Attach Photos (max ${MAX_PHOTOS})`} className="mb-3">
        <Button
          variant="accent"
          className="w-100 btn-block"
          onClick={() => photoInput.current?.click()}
          disabled={photos.length >= MAX_PHOTOS || preparing}
        >
          {preparing && <Spinner size="sm" className="me-2" />}+ Add Photo
        </Button>
        <input
          ref={photoInput}
          type="file"
          accept={PHOTO_TYPES.join(',')}
          multiple
          hidden
          onChange={(e) => {
            void addPhotos(e.target.files)
            e.target.value = ''
          }}
        />
        {photos.length > 0 && (
          <div className="previews">
            {photos.map((p, i) => (
              <div className="preview" key={p.url} title={fmtBytes(p.file.size)}>
                <img src={p.url} alt={`Photo ${i + 1}`} />
                <button type="button" className="rm" onClick={() => removePhoto(i)} aria-label="Remove photo">
                  <X size={13} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.photos && <div className="invalid-feedback d-block">{errors.photos}</div>}
        <div className="side-note">Photos are auto-compressed before saving.</div>
      </Panel>

      <Panel title="🎥 Attach Video (short clip)">
        <Button variant="outline-primary" className="w-100 btn-block" onClick={() => videoInput.current?.click()}>
          <span className="rec-dot" aria-hidden="true" />
          {video ? 'Replace video' : `Choose video (≤ ${fmtBytes(MAX_VIDEO_BYTES)})`}
        </Button>
        <input
          ref={videoInput}
          type="file"
          accept={VIDEO_TYPES.join(',')}
          hidden
          onChange={(e) => {
            pickVideo(e.target.files)
            e.target.value = ''
          }}
        />
        {video && (
          <div className="file-row">
            <span aria-hidden="true">🎞️</span>
            <span className="text-truncate">{video.name}</span>
            <span className="text-muted small ms-auto">{fmtBytes(video.size)}</span>
            <button type="button" className="btn btn-link btn-sm p-0 text-danger" onClick={() => setVideo(null)} aria-label="Remove video">
              <Trash2 size={15} />
            </button>
          </div>
        )}
        {errors.video && <div className="invalid-feedback d-block">{errors.video}</div>}
        <div className="side-note">One short clip (MP4, WEBM, MOV or 3GP) is saved with the report.</div>
      </Panel>

      <div className="hint-box mt-3">
        <span aria-hidden="true">⚠️</span> Life-threatening emergency? Call <a href="tel:911">911</a> first, then file this report. Do
        not go near floodwater, live wires or fire just to take pictures.
      </div>
    </>
  )
}
