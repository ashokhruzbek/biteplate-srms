import { Utensils } from 'lucide-react'
import DashboardSection from '../DashboardSection'
import EmptyState from '../../ui/EmptyState'
import LoadingSpinner from '../../ui/LoadingSpinner'
import { normalizePopularItem } from '../analytics/dashboardAnalytics'

function PopularItemWidget({ popularItem, menuItems = [], isLoading, error }) {
  const normalized = normalizePopularItem(popularItem)
  const menuItem = menuItems.find(
    (item) => Number(item.id) === Number(normalized?.menuItemId),
  )

  return (
    <DashboardSection
      title="Eng mashhur taom"
      description="Buyurtmalar tarixiga asoslangan natija."
    >
      {isLoading ? (
        <div className="dashboard-section__feedback">
          <LoadingSpinner label="Mashhur taom yuklanmoqda" />
        </div>
      ) : error ? (
        <EmptyState
          icon={Utensils}
          title="Mashhur taom topilmadi"
          description={error}
        />
      ) : normalized ? (
        <div className="popular-item">
          <span>Eng ko‘p buyurtma qilingan</span>
          <strong>
            {menuItem?.name ||
              normalized.name ||
              `Menyu mahsuloti #${normalized.menuItemId}`}
          </strong>
          <p>Jami miqdor: {normalized.totalQuantity}</p>
        </div>
      ) : (
        <EmptyState
          icon={Utensils}
          title="Hali maʼlumot yo‘q"
          description="Buyurtmalar tarixi shakllanganda mashhur taom shu yerda ko‘rinadi."
        />
      )}
    </DashboardSection>
  )
}

export default PopularItemWidget
