import { useState } from 'react'
import { AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'

const pricingModeOptions = [
  { value: 'STANDARD', label: 'Oddiy narx' },
  { value: 'HAPPY_HOUR', label: 'Chegirmali vaqt' },
  { value: 'LOYALTY', label: 'Sodiqlik narxi' },
]

const initialFormData = {
  tableId: '',
  waiterId: '',
  pricingMode: 'STANDARD',
  menuItemId: '',
  quantity: '1',
}

function validateOrderForm(formData) {
  const errors = {}

  if (!formData.tableId || Number(formData.tableId) <= 0) {
    errors.tableId = 'Stol tanlanishi kerak.'
  }

  if (!formData.waiterId || Number(formData.waiterId) <= 0) {
    errors.waiterId = 'Ofitsiant tanlanishi kerak.'
  }

  if (!formData.pricingMode) {
    errors.pricingMode = 'Narxlash turi tanlanishi kerak.'
  }

  if (!formData.menuItemId || Number(formData.menuItemId) <= 0) {
    errors.menuItemId = 'Menyu mahsuloti tanlanishi kerak.'
  }

  if (!formData.quantity || Number(formData.quantity) <= 0) {
    errors.quantity = 'Miqdor 0 dan katta bo‘lishi kerak.'
  }

  return errors
}

function OrderForm({
  onSubmit,
  isSubmitting,
  submitError,
  successMessage,
  tables = [],
  staff = [],
  menuItems = [],
  isReferenceLoading,
  referenceError,
}) {
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

    const nextErrors = validateOrderForm(formData)
    setValidationErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const wasCreated = await onSubmit({
      tableId: Number(formData.tableId),
      waiterId: Number(formData.waiterId),
      pricingMode: formData.pricingMode,
      items: [
        {
          menuItemId: Number(formData.menuItemId),
          quantity: Number(formData.quantity),
        },
      ],
    })

    if (wasCreated) {
      setFormData(initialFormData)
      setValidationErrors({})
    }
  }

  return (
    <form className="order-form" onSubmit={handleSubmit} noValidate>
      <div className="order-form__grid">
        <label className="form-field">
          <span>Stol</span>
          <select
            name="tableId"
            value={formData.tableId}
            onChange={handleChange}
            disabled={isSubmitting || isReferenceLoading}
          >
            <option value="">Stol tanlang</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                Stol {table.tableNumber}
              </option>
            ))}
          </select>
          {validationErrors.tableId ? <small>{validationErrors.tableId}</small> : null}
        </label>

        <label className="form-field">
          <span>Ofitsiant</span>
          <select
            name="waiterId"
            value={formData.waiterId}
            onChange={handleChange}
            disabled={isSubmitting || isReferenceLoading}
          >
            <option value="">Ofitsiant tanlang</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.fullName}
              </option>
            ))}
          </select>
          {validationErrors.waiterId ? <small>{validationErrors.waiterId}</small> : null}
        </label>

        <label className="form-field">
          <span>Narxlash turi</span>
          <select
            name="pricingMode"
            value={formData.pricingMode}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {pricingModeOptions.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
          {validationErrors.pricingMode ? (
            <small>{validationErrors.pricingMode}</small>
          ) : null}
        </label>

        <label className="form-field">
          <span>Menyu mahsuloti</span>
          <select
            name="menuItemId"
            value={formData.menuItemId}
            onChange={handleChange}
            disabled={isSubmitting || isReferenceLoading}
          >
            <option value="">Mahsulot tanlang</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {validationErrors.menuItemId ? (
            <small>{validationErrors.menuItemId}</small>
          ) : null}
        </label>

        <label className="form-field">
          <span>Miqdor</span>
          <input
            type="number"
            min="1"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {validationErrors.quantity ? <small>{validationErrors.quantity}</small> : null}
        </label>
      </div>

      {isReferenceLoading ? (
        <p className="form-message">
          <LoadingSpinner label="Maʼlumotlar yuklanmoqda" />
        </p>
      ) : null}

      {referenceError ? (
        <p className="form-message form-message--error">
          <AlertCircle size={17} aria-hidden="true" />
          {referenceError}
        </p>
      ) : null}

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

      <div className="order-form__actions">
        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting || isReferenceLoading || Boolean(referenceError)}
        >
          {isSubmitting ? (
            <LoadingSpinner label="Yaratilmoqda" />
          ) : (
            <>
              <Plus size={17} aria-hidden="true" />
              Buyurtma yaratish
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default OrderForm
