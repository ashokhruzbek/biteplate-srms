import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StaffForm from '../../components/staff/StaffForm'
import SectionCard from '../../components/ui/SectionCard'
import { createStaff } from '../../services/staffService'

function StaffCreatePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleCreateStaff(staffData) {
    setSubmitError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await createStaff(staffData)
      setSuccessMessage('Xodim muvaffaqiyatli yaratildi. Ro‘yxatga yo‘naltirilmoqda…')
      window.setTimeout(() => navigate('/staff'), 700)
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
        eyebrow="Xodimlar"
        title="Xodim qo‘shish"
        description="Yangi xodim uchun asosiy ma’lumot va lavozimni kiriting."
        actions={
          <Link to="/staff" className="secondary-button">
            <ArrowLeft size={16} aria-hidden="true" />
            Ro‘yxatga qaytish
          </Link>
        }
      />

      <SectionCard
        title="Xodim ma’lumotlari"
        description="Barcha majburiy maydonlarni to‘ldiring."
      >
        <StaffForm
          onSubmit={handleCreateStaff}
          isSubmitting={isSubmitting}
          submitError={submitError}
          successMessage={successMessage}
        />
      </SectionCard>
    </div>
  )
}

export default StaffCreatePage
