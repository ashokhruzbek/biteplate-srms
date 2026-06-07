import { Link } from 'react-router-dom'
import { ArrowLeft, Utensils } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import SectionCard from '../../components/ui/SectionCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getPopularHistoryItem } from '../../services/orderHistoryService'
import { getMenuItems } from '../../services/menuService'

function normalizePopularItem(popularItem) {
  const source = Array.isArray(popularItem) ? popularItem[0] : popularItem

  if (!source || typeof source !== 'object') {
    return null
  }

  return {
    menuItemId: source.menuItemId || source.itemId || source.id,
    totalQuantity:
      source.totalQuantity ||
      source.quantity ||
      source.totalOrdered ||
      source.count ||
      0,
  }
}

function PopularItemPage() {
  const {
    data: popularItem,
    isLoading: isPopularLoading,
    error: popularError,
  } = useAsyncData(getPopularHistoryItem, { initialData: null })

  const { data: menuItems } = useAsyncData(getMenuItems, { initialData: [] })

  const normalizedPopularItem = normalizePopularItem(popularItem)
  const popularMenuItem = menuItems.find(
    (item) => Number(item.id) === Number(normalizedPopularItem?.menuItemId),
  )

  return (
    <div className="page page--narrow">
      <PageHeader
        eyebrow="Buyurtmalar tarixi"
        title="Popular taom"
        description="Buyurtmalar tarixi ichidagi eng ko‘p buyurtma qilingan mahsulot."
        actions={
          <Link to="/order-history" className="secondary-button">
            <ArrowLeft size={16} aria-hidden="true" />
            Tarixga qaytish
          </Link>
        }
      />

      <SectionCard
        title="Eng mashhur menyu mahsuloti"
        description="Tarix bo‘yicha eng yuqori talabga ega taom."
      >
        {isPopularLoading ? (
          <div className="history-side-feedback">
            <LoadingSpinner label="Mashhur mahsulot yuklanmoqda" />
          </div>
        ) : popularError ? (
          <EmptyState
            icon={Utensils}
            title="Mashhur mahsulot yuklanmadi"
            description={popularError}
          />
        ) : normalizedPopularItem ? (
          <div className="history-popular-card">
            <span>Eng mashhur mahsulot</span>
            <strong>
              {popularMenuItem?.name ||
                `Menyu mahsuloti #${normalizedPopularItem.menuItemId}`}
            </strong>
            <p>Jami miqdor: {normalizedPopularItem.totalQuantity}</p>
          </div>
        ) : (
          <EmptyState
            icon={Utensils}
            title="Hali ma'lumot yo‘q"
            description="Tarix yozuvlari shakllanganda eng mashhur mahsulot shu yerda ko‘rinadi."
          />
        )}
      </SectionCard>
    </div>
  )
}

export default PopularItemPage
