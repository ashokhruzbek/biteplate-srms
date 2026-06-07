import { ClipboardList } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import { TableSkeleton } from '../ui/Skeleton'
import StatusBadge from '../ui/StatusBadge'
import {
  formatCurrency,
  formatDateTime,
  formatOrderNumber,
} from '../../utils/formatters'

function getHistoryDate(record) {
  return record.createdAt || record.timestamp || record.order?.createdAt
}

function getWaiterName(record, staffById) {
  const waiterId = record.waiterId || record.order?.waiterId

  return (
    record.waiter?.fullName ||
    record.order?.waiter?.fullName ||
    record.waiterName ||
    staffById.get(Number(waiterId))?.fullName ||
    (waiterId ? `Xodim #${waiterId}` : '--')
  )
}

function getTableNumber(record, tablesById) {
  const tableId = record.tableId || record.table?.id || record.order?.tableId

  return (
    record.table?.tableNumber ||
    record.order?.table?.tableNumber ||
    record.tableNumber ||
    tablesById.get(Number(tableId))?.tableNumber ||
    tableId ||
    '--'
  )
}

function getRecordStatus(record) {
  return record.status || record.order?.status
}

function getRecordAmount(record) {
  return record.totalAmount || record.order?.totalAmount
}

function getRecordKey(record, prefix = 'row') {
  return `${prefix}-${record.id || record.orderId}-${getHistoryDate(record) || ''}`
}

function HistoryTable({
  records,
  staffById = new Map(),
  tablesById = new Map(),
  isLoading,
  error,
}) {
  if (isLoading) {
    return <TableSkeleton rows={6} columns={6} />
  }

  if (error) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Buyurtmalar tarixi yuklanmadi"
        description={error}
      />
    )
  }

  if (records.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Tarix yozuvlari yo'q"
        description="Tanlangan filterlar bo'yicha buyurtmalar tarixi topilmadi."
      />
    )
  }

  return (
    <>
      <div className="history-table data-table">
        <table>
          <thead>
            <tr>
              <th>Buyurtma</th>
              <th>Stol</th>
              <th>Ofitsiant</th>
              <th>Summa</th>
              <th>Holat</th>
              <th>Vaqt</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={getRecordKey(record)}>
                <td>{formatOrderNumber(record)}</td>
                <td>Stol {getTableNumber(record, tablesById)}</td>
                <td>{getWaiterName(record, staffById)}</td>
                <td>{formatCurrency(getRecordAmount(record))}</td>
                <td>
                  <StatusBadge status={getRecordStatus(record)} />
                </td>
                <td>{formatDateTime(getHistoryDate(record))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="history-card-list">
        {records.map((record) => (
          <article className="history-record-card" key={getRecordKey(record, 'card')}>
            <div className="history-record-card__header">
              <div>
                <span>Buyurtma</span>
                <strong>{formatOrderNumber(record)}</strong>
              </div>
              <StatusBadge status={getRecordStatus(record)} />
            </div>

            <dl className="history-record-card__details">
              <div>
                <dt>Stol</dt>
                <dd>Stol {getTableNumber(record, tablesById)}</dd>
              </div>
              <div>
                <dt>Ofitsiant</dt>
                <dd>{getWaiterName(record, staffById)}</dd>
              </div>
              <div>
                <dt>Summa</dt>
                <dd>{formatCurrency(getRecordAmount(record))}</dd>
              </div>
              <div>
                <dt>Vaqt</dt>
                <dd>{formatDateTime(getHistoryDate(record))}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}

export default HistoryTable
