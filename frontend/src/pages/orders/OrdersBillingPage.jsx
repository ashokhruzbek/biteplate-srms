import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ReceiptText } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import BillCard from '../../components/orders/BillCard'
import EmptyState from '../../components/ui/EmptyState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import SectionCard from '../../components/ui/SectionCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import { generateOrderBill, getAllOrders } from '../../services/orderService'
import { formatCurrency, formatOrderNumber } from '../../utils/formatters'

function OrdersBillingPage() {
  const [searchParams] = useSearchParams()
  const preselectedOrderId = searchParams.get('order') || ''

  const {
    data: orders,
    isLoading,
    error: loadError,
  } = useAsyncData(getAllOrders, { initialData: [] })

  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [tipPercentage, setTipPercentage] = useState(10)
  const [peopleCount, setPeopleCount] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [billError, setBillError] = useState('')
  const [generatedBill, setGeneratedBill] = useState(null)

  const billableOrders = useMemo(() => {
    return [...orders]
      .filter((order) => order.status !== 'CANCELLED')
      .sort((firstOrder, secondOrder) => {
        const firstDate = new Date(firstOrder.createdAt).getTime() || 0
        const secondDate = new Date(secondOrder.createdAt).getTime() || 0

        return secondDate - firstDate
      })
  }, [orders])

  useEffect(() => {
    if (!selectedOrderId && preselectedOrderId) {
      setSelectedOrderId(preselectedOrderId)
    } else if (!selectedOrderId && billableOrders.length > 0) {
      setSelectedOrderId(String(billableOrders[0].id))
    }
  }, [preselectedOrderId, billableOrders, selectedOrderId])

  const selectedOrder = billableOrders.find(
    (order) => String(order.id) === String(selectedOrderId),
  )

  async function handleGenerateBill(event) {
    event.preventDefault()

    if (!selectedOrder) {
      setBillError('Avval buyurtmani tanlang.')
      return
    }

    setBillError('')
    setGeneratedBill(null)
    setIsGenerating(true)

    try {
      const billResponse = await generateOrderBill(selectedOrder.id, {
        tipPercentage: Number(tipPercentage) || 0,
        peopleCount: Number(peopleCount) || 1,
      })

      setGeneratedBill({
        bill: billResponse?.bill || billResponse,
        order: selectedOrder,
      })
    } catch (error) {
      setBillError(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="page page--narrow">
      <PageHeader
        eyebrow="Buyurtmalar"
        title="Billing"
        description="Buyurtmani tanlab, insho‘na (tip) va kishilar soni bilan hisob yarating (Facade namunasi)."
        actions={
          <Link to="/orders" className="secondary-button">
            <ArrowLeft size={16} aria-hidden="true" />
            Ro‘yxatga qaytish
          </Link>
        }
      />

      <SectionCard
        title="Hisob yaratish"
        description="To‘lov tafsilotlarini belgilang va hisobni shakllantiring."
      >
        {isLoading ? (
          <div className="billing-feedback">
            <LoadingSpinner label="Buyurtmalar yuklanmoqda" />
          </div>
        ) : loadError ? (
          <EmptyState
            icon={ReceiptText}
            title="Buyurtmalar yuklanmadi"
            description={loadError}
          />
        ) : billableOrders.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="Hisob uchun buyurtma yo‘q"
            description="Faol buyurtmalar yaratilganda shu yerda ko‘rinadi."
          />
        ) : (
          <form className="billing-form" onSubmit={handleGenerateBill}>
            <label className="form-field">
              <span>Buyurtma</span>
              <select
                value={selectedOrderId}
                onChange={(event) => setSelectedOrderId(event.target.value)}
              >
                {billableOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {formatOrderNumber(order)} · Stol{' '}
                    {order.table?.tableNumber || order.tableNumber || '--'} ·{' '}
                    {formatCurrency(order.totalAmount)}
                  </option>
                ))}
              </select>
            </label>

            <div className="billing-form__row">
              <label className="form-field">
                <span>Insho‘na (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tipPercentage}
                  onChange={(event) => setTipPercentage(event.target.value)}
                />
              </label>

              <label className="form-field">
                <span>Kishilar soni</span>
                <input
                  type="number"
                  min="1"
                  value={peopleCount}
                  onChange={(event) => setPeopleCount(event.target.value)}
                />
              </label>
            </div>

            {billError ? (
              <p className="form-message form-message--error">{billError}</p>
            ) : null}

            <button
              type="submit"
              className="primary-button"
              disabled={isGenerating}
            >
              <ReceiptText size={16} aria-hidden="true" />
              {isGenerating ? 'Yaratilmoqda…' : 'Hisob yaratish'}
            </button>
          </form>
        )}
      </SectionCard>

      {generatedBill ? (
        <BillCard
          bill={generatedBill.bill}
          order={generatedBill.order}
          onClose={() => setGeneratedBill(null)}
        />
      ) : null}
    </div>
  )
}

export default OrdersBillingPage
