import { formatCurrency } from '../../utils/formatters'
import AvailabilityBadge from './AvailabilityBadge'

function MenuCard({ item }) {
  return (
    <article className="menu-card">
      <div className="menu-card__header">
        <div>
          <span className="menu-card__category">{item.category || 'Kategoriya yo‘q'}</span>
          <h3>{item.name || 'Nomsiz mahsulot'}</h3>
        </div>
        <AvailabilityBadge available={item.available !== false} />
      </div>

      <p className="menu-card__description">
        {item.description || 'Tavsif kiritilmagan.'}
      </p>

      <div className="menu-card__footer">
        <span>Asosiy narx</span>
        <strong>{formatCurrency(item.basePrice)}</strong>
      </div>
    </article>
  )
}

export default MenuCard
