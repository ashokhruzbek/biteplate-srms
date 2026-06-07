import { ChefHat, CircleCheck, CircleX, Flame } from 'lucide-react'
import DashboardStatCard from '../DashboardStatCard'
import DashboardSection from '../DashboardSection'
import RecentOrdersTable from '../RecentOrdersTable'
import { getOrderStats, sortByNewest } from '../analytics/dashboardAnalytics'

const KITCHEN_STATUSES = new Set(['PENDING', 'PREPARING', 'READY'])

function ChefDashboard({ resources, errors, isLoading }) {
  const { orders } = resources

  const orderStats = getOrderStats(orders)
  const kitchenOrders = sortByNewest(
    orders.filter((order) => KITCHEN_STATUSES.has(order.status)),
  ).slice(0, 8)

  const kpis = [
    {
      title: 'Tayyorlanmoqda',
      value: orderStats.preparing,
      subtitle: 'Oshxonada faol buyurtmalar',
      icon: Flame,
      error: errors.orders,
    },
    {
      title: 'Tayyor',
      value: orderStats.ready,
      subtitle: 'Berishga tayyor buyurtmalar',
      icon: CircleCheck,
      error: errors.orders,
    },
    {
      title: 'Kutilayotgan',
      value: orderStats.pending,
      subtitle: 'Tayyorlashni kutmoqda',
      icon: ChefHat,
      error: errors.orders,
    },
    {
      title: 'Bekor qilingan',
      value: orderStats.cancelled,
      subtitle: 'Bekor qilingan buyurtmalar',
      icon: CircleX,
      error: errors.orders,
    },
  ]

  return (
    <>
      <section className="dashboard-stats" aria-label="Oshxona ko‘rsatkichlari">
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
        title="Oshxona faoliyati"
        description="Tayyorlash navbatidagi so‘nggi buyurtmalar."
      >
        <RecentOrdersTable
          orders={kitchenOrders}
          isLoading={isLoading}
          error={errors.orders}
        />
      </DashboardSection>
    </>
  )
}

export default ChefDashboard
