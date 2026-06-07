import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import MenuItemForm from '../../components/menu/MenuItemForm'
import SectionCard from '../../components/ui/SectionCard'
import { createMenuItem } from '../../services/menuService'

function MenuCreatePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleCreateMenuItem(menuItemData) {
    setSubmitError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await createMenuItem(menuItemData)
      setSuccessMessage(
        'Menyu mahsuloti muvaffaqiyatli yaratildi. Ro‘yxatga yo‘naltirilmoqda…',
      )
      window.setTimeout(() => navigate('/menu'), 700)
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
        eyebrow="Menyu"
        title="Taom qo‘shish"
        description="Menyu uchun asosiy mahsulot ma’lumotlarini kiriting."
        actions={
          <div className="page-header__actions-group">
            <Link to="/menu/customize" className="secondary-button">
              <Sparkles size={16} aria-hidden="true" />
              Moslashtirish
            </Link>
            <Link to="/menu" className="secondary-button">
              <ArrowLeft size={16} aria-hidden="true" />
              Ro‘yxatga qaytish
            </Link>
          </div>
        }
      />

      <SectionCard
        title="Taom ma’lumotlari"
        description="Nomi, narxi, kategoriyasi va mavjudligini belgilang."
      >
        <MenuItemForm
          onSubmit={handleCreateMenuItem}
          isSubmitting={isSubmitting}
          submitError={submitError}
          successMessage={successMessage}
        />
      </SectionCard>
    </div>
  )
}

export default MenuCreatePage
