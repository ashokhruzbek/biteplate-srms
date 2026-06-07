import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getDashboardData } from '../services/dashboardService'
import { ROLES } from '../config/permissions'
import ManagerDashboard from '../components/dashboard/widgets/ManagerDashboard'
import WaiterDashboard from '../components/dashboard/widgets/WaiterDashboard'
import ChefDashboard from '../components/dashboard/widgets/ChefDashboard'
import CashierDashboard from '../components/dashboard/widgets/CashierDashboard'

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

const DASHBOARD_BY_ROLE = {
  [ROLES.MANAGER]: ManagerDashboard,
  [ROLES.WAITER]: WaiterDashboard,
  [ROLES.CHEF]: ChefDashboard,
  [ROLES.CASHIER]: CashierDashboard,
}

const SUBTITLE_BY_ROLE = {
  [ROLES.MANAGER]:
    'Restoran bo‘yicha to‘liq analitika: buyurtmalar, stollar, xodimlar va menyu.',
  [ROLES.WAITER]:
    'Operatsion ko‘rinish: faol stollar, kutilayotgan va bugungi buyurtmalar.',
  [ROLES.CHEF]:
    'Oshxona ko‘rinishi: tayyorlanayotgan, tayyor va kutilayotgan buyurtmalar.',
  [ROLES.CASHIER]:
    'Billing ko‘rinishi: bugungi hisoblar, to‘lovlar va so‘nggi faoliyat.',
}

function Dashboard() {
  const { currentUser, currentRole } = useAuth()
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

  const RoleDashboard = DASHBOARD_BY_ROLE[currentRole] || ManagerDashboard
  const subtitle = SUBTITLE_BY_ROLE[currentRole] || SUBTITLE_BY_ROLE[ROLES.MANAGER]
  const firstName = currentUser?.fullName?.split(' ')[0] || ''

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-hero__date">{currentDate}</span>
          <h1>
            Boshqaruv paneli
            {firstName ? ` · ${firstName}` : ''}
          </h1>
          <p>{subtitle}</p>
        </div>
      </section>

      <RoleDashboard
        resources={resources}
        errors={errors}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Dashboard
