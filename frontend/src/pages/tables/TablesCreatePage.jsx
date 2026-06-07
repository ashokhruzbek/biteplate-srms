import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import TableForm from '../../components/tables/TableForm'
import SectionCard from '../../components/ui/SectionCard'
import { createTable } from '../../services/tableService'

function TablesCreatePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleCreateTable(tableData) {
    setSubmitError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await createTable(tableData)
      setSuccessMessage('Stol muvaffaqiyatli yaratildi. Ro‘yxatga yo‘naltirilmoqda…')
      window.setTimeout(() => navigate('/tables'), 700)
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
        eyebrow="Stollar"
        title="Stol qo‘shish"
        description="Stol raqami va sig‘imini kiriting."
        actions={
          <Link to="/tables" className="secondary-button">
            <ArrowLeft size={16} aria-hidden="true" />
            Ro‘yxatga qaytish
          </Link>
        }
      />

      <SectionCard
        title="Stol ma’lumotlari"
        description="Yangi stol uchun raqam va sig‘imni belgilang."
      >
        <TableForm
          onSubmit={handleCreateTable}
          isSubmitting={isSubmitting}
          submitError={submitError}
          successMessage={successMessage}
        />
      </SectionCard>
    </div>
  )
}

export default TablesCreatePage
