import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, SlidersHorizontal } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'
import { formatCurrency } from '../../utils/formatters'

const extraOptions = [
  { value: 'EXTRA_CHEESE', label: 'Qo‘shimcha pishloq' },
  { value: 'SPICY_SAUCE', label: 'Achchiq sous' },
  { value: 'GLUTEN_FREE', label: 'Glutensiz' },
]

function getResultPrice(result) {
  return (
    result?.totalPrice ||
    result?.price ||
    result?.basePrice ||
    result?.updatedPrice ||
    result?.finalPrice
  )
}

function MenuCustomizationCard({
  menuItems,
  onCustomize,
  isSubmitting,
  customizationError,
  customizationResult,
}) {
  const [selectedMenuItemId, setSelectedMenuItemId] = useState('')
  const [selectedExtras, setSelectedExtras] = useState([])
  const [validationError, setValidationError] = useState('')

  const selectedMenuItem = useMemo(() => {
    return menuItems.find((item) => item.id === Number(selectedMenuItemId))
  }, [menuItems, selectedMenuItemId])

  function handleExtraChange(extraValue) {
    setSelectedExtras((currentExtras) =>
      currentExtras.includes(extraValue)
        ? currentExtras.filter((extra) => extra !== extraValue)
        : [...currentExtras, extraValue],
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!selectedMenuItem) {
      setValidationError('Moslashtirish uchun taom tanlang.')
      return
    }

    if (selectedExtras.length === 0) {
      setValidationError('Kamida bitta qo‘shimcha tanlang.')
      return
    }

    setValidationError('')

    await onCustomize({
      name: selectedMenuItem.name,
      basePrice: selectedMenuItem.basePrice,
      extras: selectedExtras,
    })
  }

  return (
    <form className="customization-card" onSubmit={handleSubmit}>
      <div className="customization-card__fields">
        <label className="form-field">
          <span>Taom tanlang</span>
          <select
            value={selectedMenuItemId}
            onChange={(event) => {
              setSelectedMenuItemId(event.target.value)
              setValidationError('')
            }}
            disabled={isSubmitting}
          >
            <option value="">Taom tanlang</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="extras-group">
          <legend>Qo‘shimchalar</legend>
          {extraOptions.map((extra) => (
            <label key={extra.value} className="extra-option">
              <input
                type="checkbox"
                checked={selectedExtras.includes(extra.value)}
                onChange={() => handleExtraChange(extra.value)}
                disabled={isSubmitting}
              />
              <span>{extra.label}</span>
            </label>
          ))}
        </fieldset>
      </div>

      {validationError ? (
        <p className="form-message form-message--error">
          <AlertCircle size={17} aria-hidden="true" />
          {validationError}
        </p>
      ) : null}

      {customizationError ? (
        <p className="form-message form-message--error">
          <AlertCircle size={17} aria-hidden="true" />
          {customizationError}
        </p>
      ) : null}

      {customizationResult ? (
        <div className="customization-result">
          <div>
            <CheckCircle2 size={18} aria-hidden="true" />
            <strong>Moslashtirilgan taom tayyor</strong>
          </div>
          <p>
            {customizationResult.description ||
              customizationResult.name ||
              'Tanlangan qo‘shimchalar taomga qo‘shildi.'}
          </p>
          <span>Yakuniy narx: {formatCurrency(getResultPrice(customizationResult))}</span>
        </div>
      ) : null}

      <div className="customization-card__actions">
        <button type="submit" className="secondary-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoadingSpinner label="Moslashtirilmoqda" />
          ) : (
            <>
              <SlidersHorizontal size={17} aria-hidden="true" />
              Taomni moslashtirish
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default MenuCustomizationCard
