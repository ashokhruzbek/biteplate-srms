import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import MenuCustomizationCard from '../../components/menu/MenuCustomizationCard'
import SectionCard from '../../components/ui/SectionCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import { customizeMenuItem, getAllMenuItems } from '../../services/menuService'

function MenuCustomizePage() {
  const { data: menuItems, isLoading: isMenuLoading } = useAsyncData(
    getAllMenuItems,
    { initialData: [] },
  )

  const [isCustomizing, setIsCustomizing] = useState(false)
  const [customizationError, setCustomizationError] = useState('')
  const [customizationResult, setCustomizationResult] = useState(null)

  const availableItems = menuItems.filter((item) => item.available !== false)

  async function handleCustomizeMenuItem(customizationData) {
    setCustomizationError('')
    setCustomizationResult(null)
    setIsCustomizing(true)

    try {
      const result = await customizeMenuItem(customizationData)
      setCustomizationResult(result)
    } catch (error) {
      setCustomizationError(error.message)
    } finally {
      setIsCustomizing(false)
    }
  }

  return (
    <div className="page page--narrow">
      <PageHeader
        eyebrow="Menyu"
        title="Taomni moslashtirish"
        description="Tanlangan taomga qo‘shimcha variantlarni qo‘shing (Decorator namunasi)."
        actions={
          <Link to="/menu" className="secondary-button">
            <ArrowLeft size={16} aria-hidden="true" />
            Ro‘yxatga qaytish
          </Link>
        }
      />

      <SectionCard
        title="Moslashtirish"
        description="Taomni tanlab, qo‘shimcha xususiyatlarni belgilang."
      >
        <MenuCustomizationCard
          menuItems={availableItems}
          onCustomize={handleCustomizeMenuItem}
          isSubmitting={isCustomizing || isMenuLoading}
          customizationError={customizationError}
          customizationResult={customizationResult}
        />
      </SectionCard>
    </div>
  )
}

export default MenuCustomizePage
