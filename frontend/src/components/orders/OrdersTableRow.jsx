import { ReceiptText } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import {
  formatCurrency,
  formatDateTime,
  formatOrderNumber,
} from '../../utils/formatters'

function OrdersTableRow({
  order,
  isActionLoading,
  onPrepare,
  onCancel,
  onGenerateBill,
}) {
  const isPending = order.status === 'PENDING'
  const isPreparing = order.status === 'PREPARING'
  const canPrepare = isPending && !isActionLoading
  const canCancel = (isPending || isPreparing) && !isActionLoading

  return (
    <tr>
      <td>{formatOrderNumber(order)}</td>
      <td>
        Stol{' '}
        {order.table?.tableNumber || order.tableNumber || order.tableId || '--'}
      </td>
      <td>{order.waiter?.fullName || order.waiterName || order.waiterId || '--'}</td>
      <td>{formatCurrency(order.totalAmount)}</td>
      <td>
        <StatusBadge status={order.status} />
      </td>
      <td>{formatDateTime(order.createdAt)}</td>
      <td>
        <div className="order-actions">
          <button
            type="button"
            className="table-action"
            onClick={() => onPrepare(order.id)}
            disabled={!canPrepare}
          >
            Tayyorlash
          </button>
          <button
            type="button"
            className="table-action table-action--danger"
            onClick={() => onCancel(order.id)}
            disabled={!canCancel}
          >
            Bekor qilish
          </button>
          <button
            type="button"
            className="table-action"
            onClick={() => onGenerateBill(order)}
            disabled={isActionLoading}
          >
            <ReceiptText size={15} aria-hidden="true" />
            Hisob
          </button>
        </div>
      </td>
    </tr>
  )
}

export default OrdersTableRow
