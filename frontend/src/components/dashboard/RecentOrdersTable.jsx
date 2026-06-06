import { ClipboardList } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import LoadingSpinner from '../ui/LoadingSpinner'
import StatusBadge from '../ui/StatusBadge'
import { formatCurrency, formatOrderNumber } from '../../utils/formatters'

function RecentOrdersTable({ orders, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="dashboard-section__feedback">
        <LoadingSpinner label="So‘nggi buyurtmalar yuklanmoqda" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Buyurtmalar yuklanmadi"
        description={error}
      />
    )
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Buyurtmalar yo‘q"
        description="Yangi buyurtmalar yaratilganda shu yerda ko‘rinadi."
      />
    )
  }

  return (
    <div className="dashboard-orders data-table">
      <table>
        <thead>
          <tr>
            <th>Buyurtma</th>
            <th>Stol</th>
            <th>Ofitsiant</th>
            <th>Summa</th>
            <th>Holat</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{formatOrderNumber(order)}</td>
              <td>
                Stol{' '}
                {order.table?.tableNumber ||
                  order.tableNumber ||
                  order.tableId ||
                  '--'}
              </td>
              <td>
                {order.waiter?.fullName ||
                  order.waiterName ||
                  order.waiterId ||
                  '--'}
              </td>
              <td>{formatCurrency(order.totalAmount)}</td>
              <td>
                <StatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentOrdersTable
