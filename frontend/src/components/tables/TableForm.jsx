import { useState } from 'react'
import { AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'

const initialFormData = {
  tableNumber: '',
  capacity: '',
}

function validateTableForm(formData) {
  const errors = {}

  if (!formData.tableNumber || Number(formData.tableNumber) <= 0) {
    errors.tableNumber = 'Stol raqami 0 dan katta bo‘lishi kerak.'
  }

  if (!formData.capacity || Number(formData.capacity) <= 0) {
    errors.capacity = 'Sig‘im 0 dan katta bo‘lishi kerak.'
  }

  return errors
}

function TableForm({ onSubmit, isSubmitting, submitError, successMessage }) {
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

    const nextErrors = validateTableForm(formData)
    setValidationErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const wasCreated = await onSubmit({
      tableNumber: Number(formData.tableNumber),
      capacity: Number(formData.capacity),
    })

    if (wasCreated) {
      setFormData(initialFormData)
      setValidationErrors({})
    }
  }

  return (
    <form className="table-form" onSubmit={handleSubmit} noValidate>
      <div className="table-form__grid">
        <label className="form-field">
          <span>Stol raqami</span>
          <input
            type="number"
            min="1"
            name="tableNumber"
            value={formData.tableNumber}
            onChange={handleChange}
            placeholder="Masalan: 12"
            disabled={isSubmitting}
          />
          {validationErrors.tableNumber ? (
            <small>{validationErrors.tableNumber}</small>
          ) : null}
        </label>

        <label className="form-field">
          <span>Sig‘im</span>
          <input
            type="number"
            min="1"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Masalan: 4"
            disabled={isSubmitting}
          />
          {validationErrors.capacity ? <small>{validationErrors.capacity}</small> : null}
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

      <div className="table-form__actions">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoadingSpinner label="Yaratilmoqda" />
          ) : (
            <>
              <Plus size={17} aria-hidden="true" />
              Stol qo‘shish
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default TableForm
