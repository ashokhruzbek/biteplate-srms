import { BadgeDollarSign, BriefcaseBusiness, UsersRound, UtensilsCrossed } from 'lucide-react'
import StatCard from '../ui/StatCard'

function StaffStats({ staff, isLoading }) {
  const managers = staff.filter((member) => member.role === 'MANAGER').length
  const waiters = staff.filter((member) => member.role === 'WAITER').length
  const cashiers = staff.filter((member) => member.role === 'CASHIER').length

  const stats = [
    {
      title: 'Jami xodimlar',
      value: staff.length,
      icon: UsersRound,
    },
    {
      title: 'Menejerlar',
      value: managers,
      icon: BriefcaseBusiness,
    },
    {
      title: 'Ofitsiantlar',
      value: waiters,
      icon: UtensilsCrossed,
    },
    {
      title: 'Kassirlar',
      value: cashiers,
      icon: BadgeDollarSign,
    },
  ]

  return (
    <section className="staff-stats" aria-label="Xodimlar statistikasi">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          isLoading={isLoading}
        />
      ))}
    </section>
  )
}

export default StaffStats
