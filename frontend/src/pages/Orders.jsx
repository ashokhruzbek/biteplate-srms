import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ChefHat,
  ClipboardList,
  ReceiptText,
  RotateCcw,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import BillCard from '../components/orders/BillCard'
import OrderForm from '../components/orders/OrderForm'
import OrdersTable from '../components/orders/OrdersTable'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import {
  cancelOrder,
  createOrder,
  generateOrderBill,
  getAllOrders,
  prepareOrder,
  undoLastKitchenAction,
} from '../services/orderService'
import { getMenuItems } from '../services/menuService'
import { getAllStaff } from '../services/staffService'
import { getTables } from '../services/tableService'

const initialReferenceData = {
  tables: [],
  staff: [],
  menuItems: [],
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [isUndoLoading, setIsUndoLoading] = useState(false)
  const [generatedBill, setGeneratedBill] = useState(null)
  const [referenceData, setReferenceData] = useState(initialReferenceData)
  const [isReferenceLoading, setIsReferenceLoading] = useState(true)
  const [referenceError, setReferenceError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadOrders() {
      setIsLoading(true)
      setLoadError('')

      try {
        const orderList = await getAllOrders()

        if (isMounted) {
          setOrders(orderList)
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadReferenceData() {
      setIsReferenceLoading(true)
      setReferenceError('')

      try {
        const [tables, staff, menuItems] = await Promise.all([
          getTables(),
          getAllStaff(),
          getMenuItems(),
        ])

        if (isMounted) {
          setReferenceData({
            tables,
            staff,
            menuItems,
          })
        }
      } catch (error) {
        if (isMounted) {
          setReferenceError(error.message)
        }
      } finally {
        if (isMounted) {
          setIsReferenceLoading(false)
        }
      }
    }

    loadReferenceData()

    return () => {
      isMounted = false
    }
  }, [])

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

  async function handleCreateOrder(orderData) {
    setSubmitError('')
    setSuccessMessage('')
    setActionError('')
    setIsSubmitting(true)

    try {
      const createdOrder = await createOrder(orderData)

      if (createdOrder) {
        setOrders((currentOrders) => [createdOrder, ...currentOrders])
      }

      setSuccessMessage('Buyurtma muvaffaqiyatli yaratildi.')
      return true
    } catch (error) {
      setSubmitError(error.message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePrepareOrder(orderId) {
    setActionError('')
    setActionLoadingId(orderId)

    try {
      const updatedOrder = await prepareOrder(orderId)
      updateOrderInList(updatedOrder)
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
      const updatedOrder = await cancelOrder(orderId)
      updateOrderInList(updatedOrder)
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
      const updatedOrder = await undoLastKitchenAction()
      updateOrderInList(updatedOrder)
    } catch (error) {
      setActionError(error.message)
    } finally {
      setIsUndoLoading(false)
    }
  }

  async function handleGenerateBill(order) {
    setActionError('')
    setGeneratedBill(null)
    setActionLoadingId(order.id)

    try {
      const billResponse = await generateOrderBill(order.id, {
        tipPercentage: 10,
        peopleCount: 1,
      })

      setGeneratedBill({ bill: billResponse?.bill || billResponse, order })
    } catch (error) {
      setActionError(error.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="orders-page">
      <PageHeader
        title="Buyurtmalar"
        description="Restoran buyurtmalarini yaratish va oshxona holatini boshqarish."
      />

      <section className="orders-stats" aria-label="Buyurtmalar statistikasi">
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

      <div className="orders-page__content">
        <SectionCard
          id="orders-create"
          title="Buyurtma yaratish"
          description="Stol, ofitsiant va menyu mahsulotini tanlab buyurtma yarating."
        >
          <OrderForm
            onSubmit={handleCreateOrder}
            isSubmitting={isSubmitting}
            submitError={submitError}
            successMessage={successMessage}
            tables={referenceData.tables}
            staff={referenceData.staff}
            menuItems={referenceData.menuItems}
            isReferenceLoading={isReferenceLoading}
            referenceError={referenceError}
          />
        </SectionCard>

        <div className="orders-page__main" id="orders-billing">
          {generatedBill ? (
            <BillCard
              bill={generatedBill.bill}
              order={generatedBill.order}
              onClose={() => setGeneratedBill(null)}
            />
          ) : null}

          <SectionCard
            id="orders-list"
            title="Buyurtmalar ro‘yxati"
            description="Tizimdagi joriy buyurtmalar."
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
      </div>
    </div>
  )
}

export default Orders
