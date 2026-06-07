import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StaffStats from '../../components/staff/StaffStats'
import StaffTable from '../../components/staff/StaffTable'
import SectionCard from '../../components/ui/SectionCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getAllStaff } from '../../services/staffService'

function StaffListPage() {
  const {
    data: staff,
    isLoading,
    error,
  } = useAsyncData(getAllStaff, { initialData: [] })

  const sortedStaff = useMemo(() => {
    return [...(staff || [])].sort((firstMember, secondMember) => {
      const firstDate = new Date(firstMember.createdAt).getTime() || 0
      const secondDate = new Date(secondMember.createdAt).getTime() || 0

      return secondDate - firstDate
    })
  }, [staff])

  return (
    <div className="page">
      <PageHeader
        eyebrow="Xodimlar"
        title="Xodimlar ro‘yxati"
        description="Restoran jamoasi xodimlarini ko‘rib chiqing va kuzating."
        actions={
          <Link to="/staff/create" className="primary-button">
            <UserPlus size={16} aria-hidden="true" />
            Xodim qo‘shish
          </Link>
        }
      />

      <StaffStats staff={sortedStaff} isLoading={isLoading} />

      <SectionCard
        title="Barcha xodimlar"
        description="Tizimda ro‘yxatdan o‘tgan xodimlar."
      >
        <StaffTable staff={sortedStaff} isLoading={isLoading} error={error} />
      </SectionCard>
    </div>
  )
}

export default StaffListPage
