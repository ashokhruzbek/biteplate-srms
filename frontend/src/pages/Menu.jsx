import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Layers3, Utensils, XCircle } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import MenuCard from '../components/menu/MenuCard'
import MenuCustomizationCard from '../components/menu/MenuCustomizationCard'
import MenuFilterBar from '../components/menu/MenuFilterBar'
import MenuItemForm from '../components/menu/MenuItemForm'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import {
  createMenuItem,
  customizeMenuItem,
  getAllMenuItems,
} from '../services/menuService'

function getUniqueCategories(menuItems) {
  return [...new Set(menuItems.map((item) => item.category).filter(Boolean))]
}

function Menu() {
  const [menuItems, setMenuItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [customizationError, setCustomizationError] = useState('')
  const [customizationResult, setCustomizationResult] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadMenuItems() {
      setIsLoading(true)
      setLoadError('')

      try {
        const items = await getAllMenuItems()

        if (isMounted) {
          setMenuItems(items)
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMenuItems()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(() => getUniqueCategories(menuItems), [menuItems])

  const filteredMenuItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory
      const matchesSearch =
        !normalizedSearch ||
        item.name?.toLowerCase().includes(normalizedSearch) ||
        item.category?.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [menuItems, searchTerm, selectedCategory])

  const availableItems = menuItems.filter((item) => item.available !== false)
  const unavailableItems = menuItems.filter((item) => item.available === false)

  const stats = [
    {
      title: 'Jami taomlar',
      value: menuItems.length,
      icon: Utensils,
    },
    {
      title: 'Mavjud taomlar',
      value: availableItems.length,
      icon: CheckCircle2,
    },
    {
      title: 'Mavjud emas',
      value: unavailableItems.length,
      icon: XCircle,
    },
    {
      title: 'Kategoriyalar',
      value: categories.length,
      icon: Layers3,
    },
  ]

  async function handleCreateMenuItem(menuItemData) {
    setCreateError('')
    setCreateSuccess('')
    setIsCreating(true)

    try {
      const createdItem = await createMenuItem(menuItemData)

      if (createdItem) {
        setMenuItems((currentItems) => [createdItem, ...currentItems])
      }

      setCreateSuccess('Menyu mahsuloti muvaffaqiyatli yaratildi.')
      return true
    } catch (error) {
      setCreateError(error.message)
      return false
    } finally {
      setIsCreating(false)
    }
  }

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
    <div className="menu-page">
      <PageHeader
        title="Menyu boshqaruvi"
        description="Restoran taomlari, ichimliklari va moslashtirish variantlarini boshqarish."
      />

      <section className="menu-stats" aria-label="Menyu statistikasi">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            isLoading={isLoading}
            error={loadError}
          />
        ))}
      </section>

      <div className="menu-page__content">
        <div className="menu-page__side">
          <SectionCard
            title="Yangi taom qo‘shish"
            description="Menyu uchun asosiy mahsulot maʼlumotlarini kiriting."
          >
            <MenuItemForm
              onSubmit={handleCreateMenuItem}
              isSubmitting={isCreating}
              submitError={createError}
              successMessage={createSuccess}
            />
          </SectionCard>

          <SectionCard
            title="Taomni moslashtirish"
            description="Tanlangan taomga qo‘shimcha variantlarni qo‘shing."
          >
            <MenuCustomizationCard
              menuItems={availableItems}
              onCustomize={handleCustomizeMenuItem}
              isSubmitting={isCustomizing}
              customizationError={customizationError}
              customizationResult={customizationResult}
            />
          </SectionCard>
        </div>

        <SectionCard
          title="Menyu ro‘yxati"
          description="Mavjud taom va ichimliklar ro‘yxati."
        >
          <MenuFilterBar
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
          />

          {isLoading ? (
            <div className="menu-grid-feedback">
              <LoadingSpinner label="Menyu yuklanmoqda" />
            </div>
          ) : loadError ? (
            <EmptyState
              icon={AlertCircle}
              title="Menyu yuklanmadi"
              description={loadError}
            />
          ) : filteredMenuItems.length === 0 ? (
            <EmptyState
              icon={Utensils}
              title="Mos taom topilmadi"
              description="Qidiruv yoki kategoriya filterini o‘zgartirib ko‘ring."
            />
          ) : (
            <div className="menu-grid">
              {filteredMenuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

export default Menu
