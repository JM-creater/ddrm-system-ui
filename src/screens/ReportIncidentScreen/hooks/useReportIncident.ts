import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { errorMessage, fieldErrors } from '../../../api/client'
import { MAX_PHOTOS, MAX_PHOTO_BYTES, MAX_VIDEO_BYTES } from '../../../constants'
import { useAuth } from '../../../store/auth'
import type { IncidentType, Severity } from '../../../types'
import { fmtBytes } from '../../../utils/format'
import { compressPhoto } from '../../../utils/image'
import { GPS_OPTIONS, PHOTO_TYPES, VIDEO_TYPES } from '../constants/reportIncident.constants'
import { fetchPublicPuroks, submitIncidentReport } from '../services/reportIncidentService'
import type { GpsCoords, PhotoItem } from '../types/reportIncident.types'

export function useReportIncident() {
  const user = useAuth((s) => s.user)
  const navigate = useNavigate()
  const [puroks, setPuroks] = useState<string[]>([])
  const [type, setType] = useState<IncidentType | ''>('')
  const [severity, setSeverity] = useState<Severity | ''>('')
  const [purok, setPurok] = useState(user?.purok ?? '')
  const [description, setDescription] = useState('')
  const [exactLocation, setExactLocation] = useState('')
  const [coords, setCoords] = useState<GpsCoords | null>(null)
  const [locating, setLocating] = useState(false)
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [video, setVideo] = useState<File | null>(null)
  const [preparing, setPreparing] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const photoInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void fetchPublicPuroks().then(setPuroks)
  }, [])

  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), [])

  const purokOptions = useMemo(() => {
    const list = [...puroks]
    if (purok && !list.includes(purok)) list.unshift(purok)
    return list
  }, [puroks, purok])

  const clearError = (k: string) => errors[k] && setErrors((e) => ({ ...e, [k]: '' }))

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return
    const room = MAX_PHOTOS - photos.length
    if (room <= 0) {
      toast.warn(`You can attach up to ${MAX_PHOTOS} photos only.`)
      return
    }
    const picked = Array.from(files)
    if (picked.length > room) toast.warn(`Only the first ${room} photo${room > 1 ? 's were' : ' was'} added (limit is ${MAX_PHOTOS}).`)
    setPreparing(true)
    const next: PhotoItem[] = []
    for (const f of picked.slice(0, room)) {
      if (!PHOTO_TYPES.includes(f.type)) {
        toast.error(`${f.name}: use a JPG, PNG, WEBP or GIF photo.`)
        continue
      }
      const small = await compressPhoto(f)
      if (small.size > MAX_PHOTO_BYTES) {
        toast.error(`${f.name} is larger than ${fmtBytes(MAX_PHOTO_BYTES)}.`)
        continue
      }
      next.push({ file: small, url: URL.createObjectURL(small) })
    }
    setPreparing(false)
    setPhotos((p) => [...p, ...next])
    clearError('photos')
  }

  const removePhoto = (idx: number) => {
    setPhotos((list) => {
      URL.revokeObjectURL(list[idx].url)
      return list.filter((_, i) => i !== idx)
    })
  }

  const pickVideo = (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    if (!VIDEO_TYPES.includes(f.type)) {
      toast.error('Use an MP4, WEBM, MOV or 3GP video.')
      return
    }
    if (f.size > MAX_VIDEO_BYTES) {
      toast.error(`The video is ${fmtBytes(f.size)}. The limit is ${fmtBytes(MAX_VIDEO_BYTES)}; record a shorter clip.`)
      return
    }
    setVideo(f)
    clearError('video')
  }

  const locate = () => {
    if (!('geolocation' in navigator)) {
      toast.error('This device does not support GPS location.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: Math.round(pos.coords.accuracy) })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        toast.error(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied. Allow it in your browser settings or type the location instead.'
            : 'Could not get your location. Try again outside or type the location instead.',
        )
      },
      GPS_OPTIONS,
    )
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!type) e.type = 'Choose the hazard / incident type.'
    if (!severity) e.severity = 'Choose the severity.'
    if (!purok) e.purok = 'Choose the purok.'
    if (!description.trim()) e.description = 'Describe what happened.'
    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) {
      toast.error('Please complete the required fields.')
      return
    }
    const fd = new FormData()
    fd.append('type', type)
    fd.append('severity', severity)
    fd.append('purok', purok)
    fd.append('description', description.trim())
    if (exactLocation.trim()) fd.append('exactLocation', exactLocation.trim())
    if (coords) {
      fd.append('latitude', String(coords.lat))
      fd.append('longitude', String(coords.lng))
    }
    photos.forEach((p) => fd.append('photos', p.file))
    if (video) fd.append('video', video)

    setProgress(0)
    try {
      const incident = await submitIncidentReport(fd, setProgress)
      toast.success(`Report submitted to the barangay. Reference no. ${incident.reportNo}.`)
      navigate('/incidents?mine=1')
    } catch (err) {
      const fe = fieldErrors(err)
      if (Object.keys(fe).length) setErrors(fe)
      toast.error(errorMessage(err))
    } finally {
      setProgress(null)
    }
  }

  return {
    type,
    setType,
    severity,
    setSeverity,
    purok,
    setPurok,
    purokOptions,
    description,
    setDescription,
    exactLocation,
    setExactLocation,
    coords,
    setCoords,
    locating,
    locate,
    photos,
    addPhotos,
    removePhoto,
    video,
    setVideo,
    pickVideo,
    preparing,
    progress,
    submitting: progress !== null,
    errors,
    clearError,
    photoInput,
    videoInput,
    submit,
  }
}
