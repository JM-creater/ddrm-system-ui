import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { errorMessage } from '../../../api/client'
import { PageHeader, Panel } from '../../../components/ui/ui'
import type { MySurvey, SurveyForm, SurveyQuestion } from '../../../types'
import { PARTS, PROFILE_FIELDS } from '../constants/assessment.constants'
import { submitSurveyAnswers } from '../services/assessmentService'

interface Props {
  form: SurveyForm
  previous: MySurvey | null
  onCancel?: () => void
  onDone: (r: MySurvey) => void
}

export default function Questionnaire({ form, previous, onCancel, onDone }: Props) {
  const [profile, setProfile] = useState<Record<string, string>>(() => ({ ...(previous?.profile ?? {}) }))
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    const out: Record<number, number> = {}
    for (const [k, v] of Object.entries(previous?.answers ?? {})) out[Number(k)] = v
    return out
  })
  const [showMissing, setShowMissing] = useState(false)
  const [saving, setSaving] = useState(false)

  const bySection = useMemo(() => {
    const map: Record<string, SurveyQuestion[]> = {}
    for (const q of form.questions) (map[q.section] ??= []).push(q)
    return map
  }, [form.questions])

  const total = form.questions.length + PROFILE_FIELDS.length
  const done =
    form.questions.filter((q) => answers[q.id]).length + PROFILE_FIELDS.filter((f) => profile[f.key]).length
  const pct = total ? Math.round((done / total) * 100) : 0

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const missingProfile = PROFILE_FIELDS.find((f) => !profile[f.key])
    const missingQ = form.questions.find((q) => !answers[q.id])
    if (missingProfile || missingQ) {
      setShowMissing(true)
      const target = missingProfile ? `pf-${missingProfile.key}` : `q-${missingQ!.id}`
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast.error(
        missingProfile
          ? `Please answer “${missingProfile.label}” in Part I.`
          : `Please answer statement ${missingQ!.itemNo} in ${PARTS.find((p) => p.section === missingQ!.section)?.part}.`,
      )
      return
    }
    setSaving(true)
    try {
      const result = await submitSurveyAnswers({
        ageGroup: profile.ageGroup,
        sex: profile.sex,
        education: profile.education,
        householdSize: profile.householdSize,
        residency: profile.residency,
        income: profile.income,
        experiencedDisaster: profile.experiencedDisaster === 'true',
        answers,
      })
      toast.success('Thank you. Your answers were saved.')
      onDone(result)
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form onSubmit={submit} noValidate>
      <PageHeader
        icon="🗳️"
        title="Preparedness Survey"
        subtitle="Knowledge, Attitudes and Practices (KAP) questionnaire on disaster preparedness of Barangay Tabunok residents."
      />

      <Panel className="mb-3">
        <p className="mb-2">
          Read each statement and choose the answer that best describes you. There are no right or wrong answers. Your
          responses are kept confidential under the Data Privacy Act of 2012 (RA 10173) and are only used by the
          barangay to plan preparedness programs.
        </p>
        <div className="likert-key">
          {form.scale.map((s) => (
            <span key={s.value}>
              <b>{s.value}</b> – {s.label}
            </span>
          ))}
        </div>
      </Panel>

      <Panel title="Part I. Profile of the respondent" className="mb-3">
        <Row className="g-3">
          {PROFILE_FIELDS.map((f) => {
            const opts = form.profileOptions[f.key] ?? []
            const invalid = showMissing && !profile[f.key]
            return (
              <Col md={f.key === 'experiencedDisaster' ? 12 : 6} key={f.key} id={`pf-${f.key}`}>
                <Form.Label className="req">{f.label}</Form.Label>
                {opts.length <= 2 ? (
                  <div className="radio-inline-group">
                    {opts.map((o) => (
                      <Form.Check
                        key={o.value}
                        type="radio"
                        id={`${f.key}-${o.value}`}
                        name={f.key}
                        label={o.label}
                        checked={profile[f.key] === o.value}
                        onChange={() => setProfile((p) => ({ ...p, [f.key]: o.value }))}
                        isInvalid={invalid}
                      />
                    ))}
                  </div>
                ) : (
                  <Form.Select
                    value={profile[f.key] ?? ''}
                    onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                    isInvalid={invalid}
                  >
                    <option value="">Select…</option>
                    {opts.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Col>
            )
          })}
        </Row>
      </Panel>

      {PARTS.map(({ section, part }) => {
        const qs = bySection[section] ?? []
        if (!qs.length) return null
        return (
          <Panel key={section} title={`${part}. ${qs[0].sectionLabel}`} bodyClass="" className="mb-3">
            <div className="table-responsive">
              <Table className="likert mb-0 align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Statement</th>
                    {form.scale.map((s) => (
                      <th key={s.value} className="sc" title={s.label}>
                        {s.value}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {qs.map((q) => (
                    <tr key={q.id} id={`q-${q.id}`} className={showMissing && !answers[q.id] ? 'unanswered' : ''}>
                      <td className="no">{q.itemNo}</td>
                      <td className="stmt">{q.statement}</td>
                      {form.scale.map((s) => (
                        <td key={s.value} className="sc">
                          <input
                            type="radio"
                            className="form-check-input"
                            name={`q-${q.id}`}
                            value={s.value}
                            checked={answers[q.id] === Number(s.value)}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: Number(s.value) }))}
                            aria-label={`Statement ${q.itemNo}: ${s.label}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Panel>
        )
      })}

      <div className="sticky-bar">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="flex-grow-1" style={{ minWidth: 200 }}>
            <div className="small text-muted mb-1">
              {done} of {total} answered
            </div>
            <div className="progress-line">
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
          {onCancel && (
            <Button variant="outline-secondary" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={saving}>
            {saving && <Spinner size="sm" className="me-2" />}
            Submit answers
          </Button>
        </div>
      </div>
    </Form>
  )
}
