import TableStatusBadge from './TableStatusBadge'

const quickStatuses = [
  { value: 'FREE', label: 'Bo‘sh' },
  { value: 'OCCUPIED', label: 'Band' },
  { value: 'RESERVED', label: 'Rezerv' },
]

function TableCard({ table, onStatusChange, isUpdating }) {
  const currentStatus = String(table.status || 'FREE').toUpperCase()

  return (
    <article className="table-card">
      <div className="table-card__top">
        <div className="table-card__title">
          <span
            className={`table-card__indicator table-card__indicator--${currentStatus.toLowerCase()}`}
            aria-hidden="true"
          />
          <div>
            <h3>Stol {table.tableNumber}</h3>
            <p>Sig‘im: {table.capacity || '--'} kishi</p>
          </div>
        </div>
        <TableStatusBadge status={table.status} />
      </div>

      <div className="table-card__actions" aria-label="Stol holatini o‘zgartirish">
        {quickStatuses.map((status) => (
          <button
            key={status.value}
            type="button"
            className={
              currentStatus === status.value
                ? 'table-action table-action--selected'
                : 'table-action'
            }
            onClick={() => onStatusChange(table, status.value)}
            disabled={isUpdating || currentStatus === status.value}
          >
            {status.label}
          </button>
        ))}
      </div>
    </article>
  )
}

export default TableCard
