import { Col, Row } from 'react-bootstrap'
import { PageHeader } from '../../components/ui/ui'
import { fmtDate } from '../../utils/format'
import ChangePasswordForm from './components/ChangePasswordForm'
import PersonalDetailsForm from './components/PersonalDetailsForm'
import './css/ProfileScreen.css'
import { useProfile } from './hooks/useProfile'

export default function ProfileScreen() {
  const {
    user,
    isAdmin,
    form,
    set,
    errors,
    saving,
    saveProfile,
    purokOptions,
    pw,
    setPw,
    pwErrors,
    pwSaving,
    changePassword,
  } = useProfile()

  return (
    <>
      <PageHeader
        icon="👤"
        title="My Profile"
        subtitle={user ? `${user.email} · member since ${fmtDate(user.createdAt)}` : undefined}
      />
      <Row className="g-3">
        <Col lg={7}>
          <PersonalDetailsForm
            form={form}
            isAdmin={isAdmin}
            purokOptions={purokOptions}
            errors={errors}
            saving={saving}
            onChange={set}
            onSubmit={saveProfile}
          />
        </Col>
        <Col lg={5}>
          <ChangePasswordForm
            pw={pw}
            setPw={setPw}
            pwErrors={pwErrors}
            pwSaving={pwSaving}
            onSubmit={changePassword}
          />
        </Col>
      </Row>
    </>
  )
}
