import { useState } from 'react'
import { AlertCircle, CheckCircle2, UserPlus } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'

const roleOptions = [
  { value: 'WAITER', label: 'Ofitsiant' },
  { value: 'MANAGER', label: 'Menejer' },
  { value: 'CHEF', label: 'Oshpaz' },
  { value: 'CASHIER', label: 'Kassir' },
]

const initialFormData = {
  fullName: '',
  phoneNumber: '',
  password: '',
  role: 'WAITER',
}

function validateStaffForm(formData) {
  const errors = {}
  const phoneRegex = /^\+?\d{9,15}$/
  const allowedRoles = roleOptions.map((role) => role.value)

  if (!formData.fullName.trim()) {
    errors.fullName = 'To‘liq ism kiritilishi kerak.'
  }

  if (!formData.phoneNumber.trim()) {
    errors.phoneNumber = 'Telefon raqam kiritilishi kerak.'
  } else if (!phoneRegex.test(formData.phoneNumber.trim())) {
    errors.phoneNumber = 'To‘g‘ri telefon raqam kiriting (masalan: +998901112233).'
  }

  if (!formData.password) {
    errors.password = 'Parol kiritilishi kerak.'
  } else if (formData.password.length < 6) {
    errors.password = 'Parol kamida 6 belgidan iborat bo‘lishi kerak.'
  }

  if (!formData.role) {
    errors.role = 'Lavozim tanlanishi kerak.'
  } else if (!allowedRoles.includes(formData.role)) {
    errors.role = 'To‘g‘ri lavozim tanlang.'
  }

  return errors
}

function StaffForm({ onSubmit, isSubmitting, submitError, successMessage }) {
  const [formData, setFormData] = useState(initialFormData)
  const [validationErrors, setValidationErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setValidationErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validateStaffForm(formData)
    setValidationErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const wasCreated = await onSubmit({
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      password: formData.password,
      role: formData.role,
    })

    if (wasCreated) {
      setFormData(initialFormData)
      setValidationErrors({})
    }
  }

  return (
    <form className="staff-form" onSubmit={handleSubmit} noValidate>
      <div className="staff-form__grid">
        <label className="form-field">
          <span>To‘liq ism</span>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Masalan: Ali Valiyev"
            disabled={isSubmitting}
          />
          {validationErrors.fullName ? <small>{validationErrors.fullName}</small> : null}
        </label>

        <label className="form-field">
          <span>Telefon raqam</span>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+998901112233"
            disabled={isSubmitting}
          />
          {validationErrors.phoneNumber ? (
            <small>{validationErrors.phoneNumber}</small>
          ) : null}
        </label>

        <label className="form-field">
          <span>Parol</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Kamida 6 belgi"
            disabled={isSubmitting}
          />
          {validationErrors.password ? <small>{validationErrors.password}</small> : null}
        </label>

        <label className="form-field">
          <span>Lavozim</span>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {validationErrors.role ? <small>{validationErrors.role}</small> : null}
        </label>
      </div>

      {submitError ? (
        <p className="form-message form-message--error">
          <AlertCircle size={17} aria-hidden="true" />
          {submitError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="form-message form-message--success">
          <CheckCircle2 size={17} aria-hidden="true" />
          {successMessage}
        </p>
      ) : null}

      <div className="staff-form__actions">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoadingSpinner label="Yaratilmoqda" />
          ) : (
            <>
              <UserPlus size={17} aria-hidden="true" />
              Xodim qo‘shish
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default StaffForm
