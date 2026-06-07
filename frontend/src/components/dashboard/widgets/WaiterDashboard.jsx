import { CalendarDays, ClipboardList, Table2, Timer } from 'lucide-react'
import DashboardStatCard from '../DashboardStatCard'
import DashboardSection from '../DashboardSection'
import RecentOrdersTable from '../RecentOrdersTable'
import {
  getOrderStats,
  getTableCounts,
  sortByNewest,
} from '../analytics/dashboardAnalytics'

function WaiterDashboard({ resources, errors, isLoading }) {
  const { orders, tables } = resources

  const orderStats = getOrderStats(orders)
  const tableCounts = getTableCounts(tables)
  const activeTables = tableCounts.occupied + tableCounts.reserved
  const recentOrders = sortByNewest(orders).slice(0, 6)

  const kpis = [
    {
      title: 'Faol stollar',
      value: activeTables,
      subtitle: 'Band va rezerv stollar',
      icon: Table2,
      error: errors.tables,
    },
    {
      title: 'Kutilayotgan buyurtmalar',
      value: orderStats.pending,
      subtitle: 'Hali tayyorlanmagan',
      icon: Timer,
      error: errors.orders,
    },
    {
      title: 'Bugungi buyurtmalar',
      value: orderStats.today,
      subtitle: 'Bugun yaratilgan',
      icon: CalendarDays,
      error: errors.orders,
    },
    {
      title: 'Bo‘sh stollar',
      value: tableCounts.free,
      subtitle: 'Yangi mehmonlar uchun',
      icon: ClipboardList,
      error: errors.tables,
    },
  ]

  return (
    <>
      <section className="dashboard-stats" aria-label="Operatsion ko‘rsatkichlar">
        {kpis.map((kpi) => (
          <DashboardStatCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            icon={kpi.icon}
            isLoading={isLoading}
            error={kpi.error}
          />
        ))}
      </section>

      <DashboardSection
        title="So‘nggi buyurtmalar"
        description="Oxirgi buyurtmalar va ularning holati."
      >
        <RecentOrdersTable
          orders={recentOrders}
          isLoading={isLoading}
          error={errors.orders}
        />
      </DashboardSection>
    </>
  )
}

export default WaiterDashboard
