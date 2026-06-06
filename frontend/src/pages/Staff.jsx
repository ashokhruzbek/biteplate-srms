import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import StaffForm from '../components/staff/StaffForm'
import StaffStats from '../components/staff/StaffStats'
import StaffTable from '../components/staff/StaffTable'
import SectionCard from '../components/ui/SectionCard'
import { createStaff, getAllStaff } from '../services/staffService'

function Staff() {
  const [staff, setStaff] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadStaff() {
      setIsLoading(true)
      setLoadError('')

      try {
        const staffList = await getAllStaff()

        if (isMounted) {
          setStaff(staffList)
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

    loadStaff()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedStaff = useMemo(() => {
    return [...staff].sort((firstMember, secondMember) => {
      const firstDate = new Date(firstMember.createdAt).getTime() || 0
      const secondDate = new Date(secondMember.createdAt).getTime() || 0

      return secondDate - firstDate
    })
  }, [staff])

  async function handleCreateStaff(staffData) {
    setSubmitError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const createdStaff = await createStaff(staffData)

      if (createdStaff) {
        setStaff((currentStaff) => [createdStaff, ...currentStaff])
      }

      setSuccessMessage('Xodim muvaffaqiyatli yaratildi.')
      return true
    } catch (error) {
      setSubmitError(error.message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="staff-page">
      <PageHeader
        title="Xodimlarni boshqarish"
        description="Restoran jamoasi xodimlarini yaratish va ko‘rib chiqish."
      />

      <StaffStats staff={sortedStaff} isLoading={isLoading} />

      <div className="staff-page__content">
        <SectionCard
          title="Xodim yaratish"
          description="Xodim uchun asosiy maʼlumot va lavozimni kiriting."
        >
          <StaffForm
            onSubmit={handleCreateStaff}
            isSubmitting={isSubmitting}
            submitError={submitError}
            successMessage={successMessage}
          />
        </SectionCard>

        <SectionCard
          title="Xodimlar ro‘yxati"
          description="Tizimda mavjud xodimlar ro‘yxati."
        >
          <StaffTable
            staff={sortedStaff}
            isLoading={isLoading}
            error={loadError}
          />
        </SectionCard>
      </div>
    </div>
  )
}

export default Staff
