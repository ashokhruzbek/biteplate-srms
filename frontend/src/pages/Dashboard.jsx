import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Table2,
  UsersRound,
  Utensils,
} from 'lucide-react'
import DashboardSection from '../components/dashboard/DashboardSection'
import DashboardStatCard from '../components/dashboard/DashboardStatCard'
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { getDashboardData } from '../services/dashboardService'

const initialResources = {
  orders: [],
  staff: [],
  tables: [],
  menuItems: [],
  popularItem: null,
}

const initialErrors = {
  orders: '',
  staff: '',
  tables: '',
  menuItems: '',
  popularItem: '',
}

function isToday(value) {
  if (!value) {
    return false
  }

  const date = new Date(value)
  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

function getTableStatusCounts(tables) {
  return tables.reduce(
    (counts, table) => {
      const status = String(table.status || '').toUpperCase()

      if (status === 'FREE') {
        counts.free += 1
      }

      if (status === 'OCCUPIED') {
        counts.occupied += 1
      }

      if (status === 'RESERVED') {
        counts.reserved += 1
      }

      return counts
    },
    {
      free: 0,
      occupied: 0,
      reserved: 0,
    },
  )
}

function normalizePopularItem(popularItem) {
  const source = Array.isArray(popularItem) ? popularItem[0] : popularItem

  if (!source || typeof source !== 'object') {
    return null
  }

  return {
    menuItemId:
      source.menuItemId ||
      source.itemId ||
      source.id ||
      source.menu_item_id ||
      source.menuItem?.id,
    name:
      source.name ||
      source.menuItemName ||
      source.menuItem?.name ||
      source.popularItem?.name,
    totalQuantity:
      source.totalQuantity ||
      source.quantity ||
      source.totalOrdered ||
      source.count ||
      source._sum?.quantity ||
      0,
  }
}

function Dashboard() {
  const [resources, setResources] = useState(initialResources)
  const [errors, setErrors] = useState(initialErrors)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setIsLoading(true)
      setErrors(initialErrors)

      try {
        const dashboardData = await getDashboardData()

        if (isMounted) {
          setResources(dashboardData.resources)
          setErrors(dashboardData.errors)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const currentDate = new Intl.DateTimeFormat('uz-UZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  const sortedOrders = useMemo(() => {
    return [...resources.orders].sort((firstOrder, secondOrder) => {
      const firstDate = new Date(firstOrder.createdAt).getTime() || 0
      const secondDate = new Date(secondOrder.createdAt).getTime() || 0

      return secondDate - firstDate
    })
  }, [resources.orders])

  const todayOrders = sortedOrders.filter((order) => isToday(order.createdAt))
  const cancelledOrders = sortedOrders.filter(
    (order) => order.status === 'CANCELLED',
  )
  const tableStatusCounts = getTableStatusCounts(resources.tables)
  const activeTables = tableStatusCounts.occupied + tableStatusCounts.reserved
  const recentOrders = sortedOrders.slice(0, 5)
  const popularItem = normalizePopularItem(resources.popularItem)
  const popularMenuItem = resources.menuItems.find(
    (item) => item.id === Number(popularItem?.menuItemId),
  )

  const stats = [
    {
      title: 'Jami buyurtmalar',
      value: sortedOrders.length,
      subtitle: 'Tizimdagi barcha buyurtmalar',
      icon: ClipboardList,
      error: errors.orders,
    },
    {
      title: 'Bugungi buyurtmalar',
      value: todayOrders.length,
      subtitle: 'Bugun yaratilgan buyurtmalar',
      icon: CalendarDays,
      error: errors.orders,
    },
    {
      title: 'Faol stollar',
      value: activeTables,
      subtitle: 'Band yoki band qilingan stollar',
      icon: Table2,
      error: errors.tables,
    },
    {
      title: 'Jami xodimlar',
      value: resources.staff.length,
      subtitle: 'Ro‘yxatdagi xodimlar',
      icon: UsersRound,
      error: errors.staff,
    },
    {
      title: 'Menyu itemlar soni',
      value: resources.menuItems.length,
      subtitle: 'Menyudagi mahsulotlar',
      icon: Utensils,
      error: errors.menuItems,
    },
    {
      title: 'Bekor qilingan buyurtmalar',
      value: cancelledOrders.length,
      subtitle: 'Bekor qilingan holatdagi buyurtmalar',
      icon: AlertCircle,
      error: errors.orders,
    },
  ]

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-hero__date">{currentDate}</span>
          <h1>Boshqaruv paneli</h1>
          <p>
            BitePlate restoranidagi buyurtmalar, stollar, xodimlar va menyu
            holati bo‘yicha qisqa operatsion ko‘rinish.
          </p>
        </div>
      </section>

      <section className="dashboard-stats" aria-label="Boshqaruv statistikasi">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            isLoading={isLoading}
            error={stat.error}
          />
        ))}
      </section>

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
          <DashboardSection
            title="Eng mashhur taom"
            description="Buyurtmalar tarixiga asoslangan natija."
          >
            {isLoading ? (
              <div className="dashboard-section__feedback">
                <LoadingSpinner label="Mashhur taom yuklanmoqda" />
              </div>
            ) : errors.popularItem ? (
              <EmptyState
                icon={Utensils}
                title="Mashhur taom topilmadi"
                description={errors.popularItem}
              />
            ) : popularItem ? (
              <div className="popular-item">
                <span>Eng ko‘p buyurtma qilingan</span>
                <strong>
                  {popularMenuItem?.name ||
                    popularItem.name ||
                    `Menyu mahsuloti #${popularItem.menuItemId}`}
                </strong>
                <p>Jami miqdor: {popularItem.totalQuantity}</p>
              </div>
            ) : (
              <EmptyState
                icon={Utensils}
                title="Hali maʼlumot yo‘q"
                description="Buyurtmalar tarixi shakllanganda mashhur taom shu yerda ko‘rinadi."
              />
            )}
          </DashboardSection>

          <DashboardSection
            title="Stollar holati"
            description="Asosiy stol statuslari bo‘yicha ko‘rinish."
          >
            {isLoading ? (
              <div className="dashboard-section__feedback">
                <LoadingSpinner label="Stollar yuklanmoqda" />
              </div>
            ) : errors.tables ? (
              <EmptyState
                icon={Table2}
                title="Stollar yuklanmadi"
                description={errors.tables}
              />
            ) : (
              <div className="table-status-summary">
                <div>
                  <span>Bo‘sh</span>
                  <strong>{tableStatusCounts.free}</strong>
                </div>
                <div>
                  <span>Band</span>
                  <strong>{tableStatusCounts.occupied}</strong>
                </div>
                <div>
                  <span>Band qilingan</span>
                  <strong>{tableStatusCounts.reserved}</strong>
                </div>
              </div>
            )}
          </DashboardSection>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
