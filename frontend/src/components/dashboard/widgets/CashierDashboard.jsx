import { CalendarDays, CreditCard, ReceiptText, Wallet } from 'lucide-react'
import DashboardStatCard from '../DashboardStatCard'
import DashboardSection from '../DashboardSection'
import RecentOrdersTable from '../RecentOrdersTable'
import { getOrderStats, sortByNewest } from '../analytics/dashboardAnalytics'

function CashierDashboard({ resources, errors, isLoading }) {
  const { orders } = resources

  const orderStats = getOrderStats(orders)
  // To'lov kutilayotgan: bekor qilinmagan va hali yetkazilmagan buyurtmalar
  const pendingPayments =
    orderStats.pending + orderStats.preparing + orderStats.ready
  const recentOrders = sortByNewest(orders).slice(0, 6)

  const kpis = [
    {
      title: 'Bugungi hisoblar',
      value: orderStats.today,
      subtitle: 'Bugun yaratilgan buyurtmalar',
      icon: CalendarDays,
      error: errors.orders,
    },
    {
      title: 'Kutilayotgan to‘lovlar',
      value: pendingPayments,
      subtitle: 'Hali yakunlanmagan buyurtmalar',
      icon: ReceiptText,
      error: errors.orders,
    },
    {
      title: 'Yakunlangan to‘lovlar',
      value: orderStats.served,
      subtitle: 'Yetkazilgan buyurtmalar',
      icon: CreditCard,
      error: errors.orders,
    },
    {
      title: 'Jami buyurtmalar',
      value: orderStats.total,
      subtitle: 'Tizimdagi barcha buyurtmalar',
      icon: Wallet,
      error: errors.orders,
    },
  ]

  return (
    <>
      <section className="dashboard-stats" aria-label="Billing ko‘rsatkichlari">
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
        title="So‘nggi hisob faoliyati"
        description="Hisob yaratish uchun so‘nggi buyurtmalar."
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

export default CashierDashboard
