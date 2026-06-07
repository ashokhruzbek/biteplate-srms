import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Table2,
  Utensils,
  UsersRound,
} from 'lucide-react'
import DashboardStatCard from '../DashboardStatCard'
import DashboardSection from '../DashboardSection'
import DashboardChartCard from '../DashboardChartCard'
import RecentOrdersTable from '../RecentOrdersTable'
import PopularItemWidget from './PopularItemWidget'
import WeeklyOrdersTrendChart from '../charts/WeeklyOrdersTrendChart'
import OrdersByStatusChart from '../charts/OrdersByStatusChart'
import TableOccupancyChart from '../charts/TableOccupancyChart'
import {
  getOrderStats,
  getOrdersByStatus,
  getTableCounts,
  getTableOccupancy,
  getWeeklyOrdersTrend,
  sortByNewest,
} from '../analytics/dashboardAnalytics'

function ManagerDashboard({ resources, errors, isLoading }) {
  const { orders, staff, tables, menuItems, popularItem } = resources

  const orderStats = getOrderStats(orders)
  const tableCounts = getTableCounts(tables)
  const activeTables = tableCounts.occupied + tableCounts.reserved
  const recentOrders = sortByNewest(orders).slice(0, 5)

  const weeklyTrend = getWeeklyOrdersTrend(orders)
  const ordersByStatus = getOrdersByStatus(orders)
  const tableOccupancy = getTableOccupancy(tables)

  const kpis = [
    {
      title: 'Jami buyurtmalar',
      value: orderStats.total,
      subtitle: 'Tizimdagi barcha buyurtmalar',
      icon: ClipboardList,
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
      title: 'Faol stollar',
      value: activeTables,
      subtitle: 'Band va rezerv stollar',
      icon: Table2,
      error: errors.tables,
    },
    {
      title: 'Jami xodimlar',
      value: staff.length,
      subtitle: 'Ro‘yxatdagi xodimlar',
      icon: UsersRound,
      error: errors.staff,
    },
    {
      title: 'Bekor qilingan',
      value: orderStats.cancelled,
      subtitle: 'Bekor qilingan buyurtmalar',
      icon: AlertCircle,
      error: errors.orders,
    },
    {
      title: 'Menyu mahsulotlari',
      value: menuItems.length,
      subtitle: 'Menyudagi taomlar',
      icon: Utensils,
      error: errors.menuItems,
    },
  ]

  return (
    <>
      <section className="dashboard-stats" aria-label="Asosiy ko‘rsatkichlar">
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

      <div className="dashboard-charts">
        <DashboardChartCard
          title="Haftalik buyurtmalar tendentsiyasi"
          description="Oxirgi 7 kun bo‘yicha buyurtmalar soni."
          isLoading={isLoading}
        >
          <WeeklyOrdersTrendChart data={weeklyTrend} />
        </DashboardChartCard>

        <DashboardChartCard
          title="Holat bo‘yicha buyurtmalar"
          description="Buyurtmalarning joriy holat taqsimoti."
          isLoading={isLoading}
        >
          <OrdersByStatusChart data={ordersByStatus} />
        </DashboardChartCard>
      </div>

      <div className="dashboard-grid">
        <DashboardSection
          title="So‘nggi buyurtmalar"
          description="Oxirgi 5 ta buyurtmaning qisqa holati."
        >
          <RecentOrdersTable
            orders={recentOrders}
            isLoading={isLoading}
            error={errors.orders}
          />
        </DashboardSection>

        <div className="dashboard-sidebar">
          <DashboardChartCard
            title="Stol bandligi"
            description="Stollar holati taqsimoti."
            isLoading={isLoading}
            isEmpty={tableOccupancy.length === 0}
            emptyLabel="Stollar maʼlumoti yo‘q."
          >
            <TableOccupancyChart data={tableOccupancy} />
          </DashboardChartCard>

          <PopularItemWidget
            popularItem={popularItem}
            menuItems={menuItems}
            isLoading={isLoading}
            error={errors.popularItem}
          />
        </div>
      </div>
    </>
  )
}

export default ManagerDashboard
