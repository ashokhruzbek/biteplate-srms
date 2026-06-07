import { AlertCircle, UsersRound } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import { TableSkeleton } from '../ui/Skeleton'
import StaffTableRow from './StaffTableRow'

function StaffTable({ staff, isLoading, error }) {
  if (isLoading) {
    return <TableSkeleton rows={5} columns={4} />
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Xodimlar maʼlumoti yuklanmadi"
        description={error}
      />
    )
  }

  if (staff.length === 0) {
    return (
      <EmptyState
        icon={UsersRound}
        title="Xodimlar yo‘q"
        description="Yaratilgan xodimlar shu yerda ko‘rinadi."
      />
    )
  }

  return (
    <div className="staff-table data-table">
      <table>
        <thead>
          <tr>
            <th>To‘liq ism</th>
            <th>Telefon</th>
            <th>Lavozim</th>
            <th>Yaratilgan vaqt</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <StaffTableRow key={member.id || member.email} member={member} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StaffTable
