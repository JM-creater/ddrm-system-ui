import Logo from '../../components/Logo/Logo'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import './css/LoginScreen.css'
import { useLoginScreen } from './hooks/useLogin'

export default function LoginScreen() {
  const { tab, setTab, puroks } = useLoginScreen()

  return (
    <div className="auth">
      <div className={`auth-wrap ${tab === 'register' ? 'wide' : ''}`}>
        <div className="brand">
          <Logo size={40} />
          <div>
            <h1>Tabunok DRRM Information System</h1>
            <div className="over">Barangay Tabunok · Talisay City, Cebu</div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'login'} className={tab === 'login' ? 'on' : ''} onClick={() => setTab('login')}>
              Login
            </button>
            <button type="button" role="tab" aria-selected={tab === 'register'} className={tab === 'register' ? 'on' : ''} onClick={() => setTab('register')}>
              Register
            </button>
          </div>
          {tab === 'login' ? <LoginForm onRegister={() => setTab('register')} /> : <RegisterForm puroks={puroks} onLogin={() => setTab('login')} />}
        </div>

        <div className="foot">Barangay Tabunok DRRM Office · Talisay City, Cebu</div>
      </div>
    </div>
  )
}
