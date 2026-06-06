import { useState } from 'react'
import { AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'

const initialFormData = {
  name: '',
  description: '',
  category: '',
  basePrice: '',
}

function validateMenuItemForm(formData) {
  const errors = {}

  if (!formData.name.trim()) {
    errors.name = 'Taom nomi kiritilishi kerak.'
  }

  if (!formData.description.trim()) {
    errors.description = 'Tavsif kiritilishi kerak.'
  }

  if (!formData.category.trim()) {
    errors.category = 'Kategoriya kiritilishi kerak.'
  }

  if (!formData.basePrice || Number(formData.basePrice) <= 0) {
    errors.basePrice = 'Narx 0 dan katta son bo‘lishi kerak.'
  }

  return errors
}

function MenuItemForm({ onSubmit, isSubmitting, submitError, successMessage }) {
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

    const nextErrors = validateMenuItemForm(formData)
    setValidationErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const wasCreated = await onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      basePrice: Number(formData.basePrice),
    })

    if (wasCreated) {
      setFormData(initialFormData)
      setValidationErrors({})
    }
  }

  return (
    <form className="menu-form" onSubmit={handleSubmit} noValidate>
      <div className="menu-form__grid">
        <label className="form-field">
          <span>Taom nomi</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masalan: Burger"
            disabled={isSubmitting}
          />
          {validationErrors.name ? <small>{validationErrors.name}</small> : null}
        </label>

        <label className="form-field">
          <span>Kategoriya</span>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Masalan: Fast Food"
            disabled={isSubmitting}
          />
          {validationErrors.category ? <small>{validationErrors.category}</small> : null}
        </label>

        <label className="form-field">
          <span>Asosiy narx</span>
          <input
            type="number"
            min="0"
            step="0.01"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            placeholder="Masalan: 25000"
            disabled={isSubmitting}
          />
          {validationErrors.basePrice ? (
            <small>{validationErrors.basePrice}</small>
          ) : null}
        </label>

        <label className="form-field menu-form__description">
          <span>Tavsif</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Taom haqida qisqa tavsif"
            disabled={isSubmitting}
            rows="4"
          />
          {validationErrors.description ? (
            <small>{validationErrors.description}</small>
          ) : null}
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

      <div className="menu-form__actions">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoadingSpinner label="Yaratilmoqda" />
          ) : (
            <>
              <Plus size={17} aria-hidden="true" />
              Menyuga qo‘shish
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default MenuItemForm
