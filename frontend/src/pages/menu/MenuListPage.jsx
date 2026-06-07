import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  Layers3,
  Plus,
  Utensils,
  XCircle,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import MenuCard from '../../components/menu/MenuCard'
import MenuFilterBar from '../../components/menu/MenuFilterBar'
import EmptyState from '../../components/ui/EmptyState'
import { CardSkeleton } from '../../components/ui/Skeleton'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getAllMenuItems } from '../../services/menuService'

function getUniqueCategories(menuItems) {
  return [...new Set(menuItems.map((item) => item.category).filter(Boolean))]
}

function MenuListPage() {
  const {
    data: menuItems,
    isLoading,
    error: loadError,
  } = useAsyncData(getAllMenuItems, { initialData: [] })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const categories = useMemo(
    () => getUniqueCategories(menuItems),
    [menuItems],
  )

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
    { title: 'Jami taomlar', value: menuItems.length, icon: Utensils },
    { title: 'Mavjud taomlar', value: availableItems.length, icon: CheckCircle2 },
    { title: 'Mavjud emas', value: unavailableItems.length, icon: XCircle },
    { title: 'Kategoriyalar', value: categories.length, icon: Layers3 },
  ]

  return (
    <div className="page">
      <PageHeader
        eyebrow="Menyu"
        title="Menyular ro‘yxati"
        description="Restoran taom va ichimliklarini ko‘rib chiqing."
        actions={
          <Link to="/menu/create" className="primary-button">
            <Plus size={16} aria-hidden="true" />
            Taom qo‘shish
          </Link>
        }
      />

      <section className="stats-grid" aria-label="Menyu statistikasi">
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
          <CardSkeleton count={6} />
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
  )
}

export default MenuListPage
