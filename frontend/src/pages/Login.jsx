import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff, LogIn, UtensilsCrossed } from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useAuth } from '../context/AuthContext'

const PHONE_PREFIX = '+998'

function UzFlag() {
  return (
    <svg
      className="login-phone__flag"
      viewBox="0 0 24 16"
      width="24"
      height="16"
      aria-hidden="true"
    >
      <rect width="24" height="16" rx="2" fill="#fff" />
      <rect width="24" height="5" rx="2" fill="#0099b5" />
      <rect y="11" width="24" height="5" rx="2" fill="#1eb53a" />
      <rect y="5.4" width="24" height="0.7" fill="#ce1126" />
      <rect y="9.9" width="24" height="0.7" fill="#ce1126" />
    </svg>
  )
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const [phoneRest, setPhoneRest] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = location.state?.from || '/'

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handlePhoneChange(event) {
    // Faqat raqamlar, maksimum 9 ta (masalan 901112233)
    const digits = event.target.value.replace(/\D/g, '').slice(0, 9)
    setPhoneRest(digits)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (phoneRest.length < 9) {
      setError('Telefon raqamni to‘liq kiriting (9 ta raqam).')
      return
    }

    if (!password) {
      setError('Parolni kiriting.')
      return
    }

    const phoneNumber = `${PHONE_PREFIX}${phoneRest}`

    setIsSubmitting(true)
    const result = await login(phoneNumber, password)
    setIsSubmitting(false)

    if (result.ok) {
      navigate(redirectTo, { replace: true })
    } else {
      setError(result.error || 'Tizimga kirib bo‘lmadi.')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-card__brand">
          <span className="login-card__logo" aria-hidden="true">
            <UtensilsCrossed size={24} />
          </span>
          <div>
            <strong>BitePlate</strong>
            <span>Restoran boshqaruv tizimi</span>
          </div>
        </div>

        <div className="login-card__heading">
          <h1>Tizimga kirish</h1>
          <p>Telefon raqam va parol orqali hisobingizga kiring.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            <span>
              Telefon raqam <em>*</em>
            </span>
            <div className="login-phone">
              <span className="login-phone__prefix">
                <UzFlag />
                {PHONE_PREFIX}
              </span>
              <input
                type="tel"
                inputMode="numeric"
                name="phoneNumber"
                value={phoneRest}
                onChange={handlePhoneChange}
                placeholder="90 111 22 33"
                autoComplete="username"
                disabled={isSubmitting}
              />
            </div>
          </label>

          <label className="form-field">
            <span>
              Parol <em>*</em>
            </span>
            <div className="login-password">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Parolingiz"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="login-password__toggle"
                aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                onClick={() => setShowPassword((shown) => !shown)}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </label>

          <label className="login-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Eslab qolish</span>
          </label>

          {error ? (
            <p className="form-message form-message--error">
              <AlertCircle size={17} aria-hidden="true" />
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="primary-button login-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner label="Kirilmoqda" />
            ) : (
              <>
                <LogIn size={18} aria-hidden="true" />
                Kirish
              </>
            )}
          </button>
        </form>

        <p className="login-card__hint">
          Hisob yo‘qmi? Hisoblarni faqat menejer (admin) yaratadi.
        </p>
      </div>
    </div>
  )
}

export default Login
