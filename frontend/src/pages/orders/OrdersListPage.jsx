import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ChefHat,
  ClipboardList,
  Plus,
  ReceiptText,
  RotateCcw,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import OrdersTable from '../../components/orders/OrdersTable'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  cancelOrder,
  getAllOrders,
  prepareOrder,
  undoLastKitchenAction,
} from '../../services/orderService'

function OrdersListPage() {
  const navigate = useNavigate()
  const {
    data: orders,
    setData: setOrders,
    isLoading,
    error: loadError,
  } = useAsyncData(getAllOrders, { initialData: [] })

  const [actionError, setActionError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [isUndoLoading, setIsUndoLoading] = useState(false)

  const sortedOrders = useMemo(() => {
    return [...orders].sort((firstOrder, secondOrder) => {
      const firstDate = new Date(firstOrder.createdAt).getTime() || 0
      const secondDate = new Date(secondOrder.createdAt).getTime() || 0

      return secondDate - firstDate
    })
  }, [orders])

  const orderStats = [
    {
      title: 'Jami buyurtmalar',
      value: sortedOrders.length,
      icon: ClipboardList,
    },
    {
      title: 'Kutilayotgan',
      value: sortedOrders.filter((order) => order.status === 'PENDING').length,
      icon: ReceiptText,
    },
    {
      title: 'Tayyorlanmoqda',
      value: sortedOrders.filter((order) => order.status === 'PREPARING').length,
      icon: ChefHat,
    },
    {
      title: 'Bekor qilingan',
      value: sortedOrders.filter((order) => order.status === 'CANCELLED').length,
      icon: AlertCircle,
    },
  ]

  function updateOrderInList(updatedOrder) {
    if (!updatedOrder?.id) {
      return
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    )
  }

  async function handlePrepareOrder(orderId) {
    setActionError('')
    setActionLoadingId(orderId)

    try {
      updateOrderInList(await prepareOrder(orderId))
    } catch (error) {
      setActionError(error.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleCancelOrder(orderId) {
    setActionError('')
    setActionLoadingId(orderId)

    try {
      updateOrderInList(await cancelOrder(orderId))
    } catch (error) {
      setActionError(error.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleUndoLastAction() {
    setActionError('')
    setIsUndoLoading(true)

    try {
      updateOrderInList(await undoLastKitchenAction())
    } catch (error) {
      setActionError(error.message)
    } finally {
      setIsUndoLoading(false)
    }
  }

  function handleGenerateBill(order) {
    navigate(`/orders/billing?order=${order.id}`)
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Buyurtmalar"
        title="Buyurtmalar ro‘yxati"
        description="Tizimdagi joriy buyurtmalarni boshqaring va oshxona holatini kuzating."
        actions={
          <Link to="/orders/create" className="primary-button">
            <Plus size={16} aria-hidden="true" />
            Buyurtma yaratish
          </Link>
        }
      />

      <section className="stats-grid" aria-label="Buyurtmalar statistikasi">
        {orderStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            isLoading={isLoading}
          />
        ))}
      </section>

      <SectionCard
        title="Buyurtmalar"
        description="Buyurtmalarni tayyorlash, bekor qilish va hisob yaratish."
      >
        <div className="orders-toolbar">
          <button
            type="button"
            className="secondary-button"
            onClick={handleUndoLastAction}
            disabled={isUndoLoading}
          >
            <RotateCcw size={16} aria-hidden="true" />
            {isUndoLoading ? 'Bekor qilinmoqda' : 'Oxirgi amalni bekor qilish'}
          </button>
        </div>

        {actionError ? (
          <p className="orders-action-error">
            <AlertCircle size={17} aria-hidden="true" />
            {actionError}
          </p>
        ) : null}

        <OrdersTable
          orders={sortedOrders}
          isLoading={isLoading}
          error={loadError}
          actionLoadingId={actionLoadingId}
          onPrepare={handlePrepareOrder}
          onCancel={handleCancelOrder}
          onGenerateBill={handleGenerateBill}
        />
      </SectionCard>
    </div>
  )
}

export default OrdersListPage
