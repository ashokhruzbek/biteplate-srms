import { AlertCircle, ClipboardList } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import { TableSkeleton } from '../ui/Skeleton'
import OrdersTableRow from './OrdersTableRow'

function OrdersTable({
  orders,
  isLoading,
  error,
  actionLoadingId,
  canKitchen = true,
  canBill = true,
  onPrepare,
  onCancel,
  onGenerateBill,
}) {
  if (isLoading) {
    return <TableSkeleton rows={5} columns={7} />
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
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
        description="Yaratilgan buyurtmalar shu yerda ko‘rinadi."
      />
    )
  }

  return (
    <div className="orders-table data-table">
      <table>
        <thead>
          <tr>
            <th>Buyurtma</th>
            <th>Stol</th>
            <th>Ofitsiant</th>
            <th>Summa</th>
            <th>Holat</th>
            <th>Vaqt</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrdersTableRow
              key={order.id}
              order={order}
              isActionLoading={actionLoadingId === order.id}
              canKitchen={canKitchen}
              canBill={canBill}
              onPrepare={onPrepare}
              onCancel={onCancel}
              onGenerateBill={onGenerateBill}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersTable
