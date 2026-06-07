import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import OrderForm from '../../components/orders/OrderForm'
import SectionCard from '../../components/ui/SectionCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import { createOrder } from '../../services/orderService'
import { getMenuItems } from '../../services/menuService'
import { getAllStaff } from '../../services/staffService'
import { getTables } from '../../services/tableService'

const initialReferenceData = {
  tables: [],
  staff: [],
  menuItems: [],
}

async function loadReferenceData() {
  const [tables, staff, menuItems] = await Promise.all([
    getTables(),
    getAllStaff(),
    getMenuItems(),
  ])

  return { tables, staff, menuItems }
}

function OrdersCreatePage() {
  const navigate = useNavigate()
  const {
    data: referenceData,
    isLoading: isReferenceLoading,
    error: referenceError,
  } = useAsyncData(loadReferenceData, { initialData: initialReferenceData })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleCreateOrder(orderData) {
    setSubmitError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await createOrder(orderData)
      setSuccessMessage(
        'Buyurtma muvaffaqiyatli yaratildi. Ro‘yxatga yo‘naltirilmoqda…',
      )
      window.setTimeout(() => navigate('/orders'), 700)
      return true
    } catch (error) {
      setSubmitError(error.message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page page--narrow">
      <PageHeader
        eyebrow="Buyurtmalar"
        title="Buyurtma yaratish"
        description="Stol, ofitsiant va menyu mahsulotini tanlab buyurtma yarating."
        actions={
          <Link to="/orders" className="secondary-button">
            <ArrowLeft size={16} aria-hidden="true" />
            Ro‘yxatga qaytish
          </Link>
        }
      />

      <SectionCard
        title="Yangi buyurtma"
        description="Buyurtma tafsilotlarini to‘ldiring."
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
    </div>
  )
}

export default OrdersCreatePage
