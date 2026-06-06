import { X } from 'lucide-react'
import { formatCurrency, formatOrderNumber } from '../../utils/formatters'

function readBillAmount(bill, keys) {
  const key = keys.find((item) => bill?.[item] !== undefined && bill?.[item] !== null)
  return key ? bill[key] : undefined
}

function BillCard({ bill, order, onClose }) {
  if (!bill) {
    return null
  }

  const subtotal = readBillAmount(bill, ['subtotal', 'subTotal'])
  const tax = readBillAmount(bill, ['tax'])
  const tip = readBillAmount(bill, ['tip', 'tipAmount'])
  const total = readBillAmount(bill, ['total'])
  const splitAmountPerPerson = readBillAmount(bill, [
    'splitAmountPerPerson',
    'splitAmount',
    'amountPerPerson',
    'perPersonAmount',
  ])

  return (
    <section className="bill-card" aria-label="Yaratilgan hisob-kitob">
      <div className="bill-card__header">
        <div>
          <h3>Hisob-kitob</h3>
          <p>{formatOrderNumber(order)}</p>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Hisobni yopish">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <dl className="bill-card__list">
        <div>
          <dt>Oraliq summa</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div>
          <dt>Soliq</dt>
          <dd>{formatCurrency(tax)}</dd>
        </div>
        <div>
          <dt>Choychaqa</dt>
          <dd>{formatCurrency(tip)}</dd>
        </div>
        <div>
          <dt>Jami</dt>
          <dd>{formatCurrency(total)}</dd>
        </div>
        <div>
          <dt>Bir kishiga</dt>
          <dd>{formatCurrency(splitAmountPerPerson)}</dd>
        </div>
      </dl>
    </section>
  )
}

export default BillCard
