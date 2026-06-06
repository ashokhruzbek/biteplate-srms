import { ClipboardList } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import LoadingSpinner from '../ui/LoadingSpinner'
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

function HistoryTable({ records, staffById, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="history-table__feedback">
        <LoadingSpinner label="Tarix yuklanmoqda" />
      </div>
    )
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
        title="Tarix yozuvlari yo‘q"
        description="Tanlangan filterlar bo‘yicha buyurtmalar tarixi topilmadi."
      />
    )
  }

  return (
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
          {records.map((record) => {
            const tableNumber =
              record.table?.tableNumber ||
              record.order?.table?.tableNumber ||
              record.tableNumber ||
              record.tableId ||
              '--'
            const status = record.status || record.order?.status
            const totalAmount = record.totalAmount || record.order?.totalAmount

            return (
              <tr key={`${record.id || record.orderId}-${getHistoryDate(record) || ''}`}>
                <td>{formatOrderNumber(record)}</td>
                <td>Stol {tableNumber}</td>
                <td>{getWaiterName(record, staffById)}</td>
                <td>{formatCurrency(totalAmount)}</td>
                <td>
                  <StatusBadge status={status} />
                </td>
                <td>{formatDateTime(getHistoryDate(record))}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTable
