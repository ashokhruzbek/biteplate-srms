import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Table2,
  Utensils,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import HistoryFilters from '../components/history/HistoryFilters'
import HistoryStatCard from '../components/history/HistoryStatCard'
import HistoryTable from '../components/history/HistoryTable'
import IteratorInfoCard from '../components/history/IteratorInfoCard'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import SectionCard from '../components/ui/SectionCard'
import {
  getIteratorHistoryRecords,
  getOrderHistory,
  getOrderHistoryByTable,
  getPopularHistoryItem,
} from '../services/orderHistoryService'
import { getMenuItems } from '../services/menuService'
import { getAllStaff } from '../services/staffService'
import { getTables } from '../services/tableService'
import { formatCurrency, formatOrderNumber } from '../utils/formatters'

const emptyFilters = {
  startDate: '',
  endDate: '',
  tableId: '',
}

function getRecordDate(record) {
  return record.createdAt || record.timestamp || record.order?.createdAt
}

function getRecordTableId(record) {
  return record.tableId || record.table?.id || record.order?.tableId
}

function getRecordAmount(record) {
  return Number(record.totalAmount || record.order?.totalAmount || 0)
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

function isInsideDateRange(record, filters) {
  const createdAt = getRecordDate(record)

  if (!createdAt || (!filters.startDate && !filters.endDate)) {
    return true
  }

  const createdTime = new Date(createdAt).getTime()

  if (Number.isNaN(createdTime)) {
    return false
  }

  if (filters.startDate) {
    const startTime = new Date(`${filters.startDate}T00:00:00`).getTime()

    if (createdTime < startTime) {
      return false
    }
  }

  if (filters.endDate) {
    const endTime = new Date(`${filters.endDate}T23:59:59`).getTime()

    if (createdTime > endTime) {
      return false
    }
  }

  return true
}

function getAverageAmount(records) {
  if (records.length === 0) {
    return formatCurrency(0)
  }

  const total = records.reduce((sum, record) => sum + getRecordAmount(record), 0)

  return formatCurrency(total / records.length)
}

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

function getFilterError(filters) {
  if ((filters.startDate && !filters.endDate) || (!filters.startDate && filters.endDate)) {
    return 'Boshlanish va tugash sanalarini birga kiriting.'
  }

  if (filters.startDate && filters.endDate) {
    const startTime = new Date(`${filters.startDate}T00:00:00`).getTime()
    const endTime = new Date(`${filters.endDate}T23:59:59`).getTime()

    if (startTime > endTime) {
      return "Boshlanish sanasi tugash sanasidan keyin bo'lmasligi kerak."
    }
  }

  return ''
}

function OrderHistory() {
  const [historyRecords, setHistoryRecords] = useState([])
  const [iteratorRecords, setIteratorRecords] = useState([])
  const [popularItem, setPopularItem] = useState(null)
  const [tables, setTables] = useState([])
  const [staff, setStaff] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isReferenceLoading, setIsReferenceLoading] = useState(true)
  const [isIteratorLoading, setIsIteratorLoading] = useState(true)
  const [isPopularLoading, setIsPopularLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [referenceError, setReferenceError] = useState('')
  const [iteratorError, setIteratorError] = useState('')
  const [popularError, setPopularError] = useState('')

  async function loadHistory(nextFilters = appliedFilters) {
    setIsLoading(true)
    setLoadError('')

    try {
      const filterError = getFilterError(nextFilters)

      if (filterError) {
        setLoadError(filterError)
        return
      }

      const records = nextFilters.tableId
        ? await getOrderHistoryByTable(nextFilters.tableId)
        : await getOrderHistory({
            startDate: nextFilters.startDate,
            endDate: nextFilters.endDate,
          })

      setHistoryRecords(records)
    } catch (error) {
      setLoadError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadInitialHistory() {
      setIsLoading(true)
      setLoadError('')

      try {
        const records = await getOrderHistory()

        if (isMounted) {
          setHistoryRecords(records)
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

    loadInitialHistory()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadReferenceData() {
      setIsReferenceLoading(true)
      setReferenceError('')

      try {
        const [tableList, staffList, menuItemList] = await Promise.all([
          getTables(),
          getAllStaff(),
          getMenuItems(),
        ])

        if (isMounted) {
          setTables(tableList)
          setStaff(staffList)
          setMenuItems(menuItemList)
        }
      } catch (error) {
        if (isMounted) {
          setReferenceError(error.message)
        }
      } finally {
        if (isMounted) {
          setIsReferenceLoading(false)
        }
      }
    }

    loadReferenceData()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadIteratorRecords() {
      setIsIteratorLoading(true)
      setIteratorError('')

      try {
        const records = await getIteratorHistoryRecords()

        if (isMounted) {
          setIteratorRecords(records)
        }
      } catch (error) {
        if (isMounted) {
          setIteratorError(error.message)
        }
      } finally {
        if (isMounted) {
          setIsIteratorLoading(false)
        }
      }
    }

    loadIteratorRecords()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadPopularItem() {
      setIsPopularLoading(true)
      setPopularError('')

      try {
        const item = await getPopularHistoryItem()

        if (isMounted) {
          setPopularItem(item)
        }
      } catch (error) {
        if (isMounted) {
          setPopularError(error.message)
        }
      } finally {
        if (isMounted) {
          setIsPopularLoading(false)
        }
      }
    }

    loadPopularItem()

    return () => {
      isMounted = false
    }
  }, [])

  const staffById = useMemo(() => {
    return new Map(staff.map((staffMember) => [Number(staffMember.id), staffMember]))
  }, [staff])

  const tablesById = useMemo(() => {
    return new Map(tables.map((table) => [Number(table.id), table]))
  }, [tables])

  const visibleRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return [...historyRecords]
      .filter((record) => {
        if (!appliedFilters.tableId) {
          return true
        }

        return Number(getRecordTableId(record)) === Number(appliedFilters.tableId)
      })
      .filter((record) => isInsideDateRange(record, appliedFilters))
      .filter((record) => {
        if (!normalizedSearch) {
          return true
        }

        const rawOrderNumber =
          record.orderNumber || record.order?.orderNumber || record.orderId || record.id
        const shortOrderNumber = formatOrderNumber(record)

        return (
          String(rawOrderNumber || '').toLowerCase().includes(normalizedSearch) ||
          shortOrderNumber.toLowerCase().includes(normalizedSearch)
        )
      })
      .sort((firstRecord, secondRecord) => {
        const firstDate = new Date(getRecordDate(firstRecord)).getTime() || 0
        const secondDate = new Date(getRecordDate(secondRecord)).getTime() || 0

        return secondDate - firstDate
      })
  }, [historyRecords, appliedFilters, searchTerm])

  const uniqueTableCount = new Set(
    visibleRecords.map((record) => getRecordTableId(record)).filter(Boolean),
  ).size
  const todayOrders = visibleRecords.filter((record) => isToday(getRecordDate(record)))

  const stats = [
    {
      title: 'Jami tarix buyurtmalari',
      value: visibleRecords.length,
      icon: ClipboardList,
    },
    {
      title: 'Bugungi buyurtmalar',
      value: todayOrders.length,
      icon: CalendarDays,
    },
    {
      title: 'Unikal stollar',
      value: uniqueTableCount,
      icon: Table2,
    },
    {
      title: "O'rtacha summa",
      value: getAverageAmount(visibleRecords),
      icon: BarChart3,
    },
  ]

  const normalizedPopularItem = normalizePopularItem(popularItem)
  const popularMenuItem = menuItems.find(
    (item) => Number(item.id) === Number(normalizedPopularItem?.menuItemId),
  )

  function handleFilterChange(name, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  async function handleApplyFilters() {
    const filterError = getFilterError(filters)

    if (filterError) {
      setLoadError(filterError)
      return
    }

    setAppliedFilters(filters)
    await loadHistory(filters)
  }

  async function handleClearFilters() {
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setSearchTerm('')
    await loadHistory(emptyFilters)
  }

  return (
    <div className="order-history-page">
      <PageHeader
        title="Buyurtmalar tarixi"
        description="Singleton tarix jurnali, iterator orqali yuritish va restoran buyurtmalari bo'yicha hisobot ko'rinishi."
      />

      <section className="order-history-stats" aria-label="Tarix statistikasi">
        {stats.map((stat) => (
          <HistoryStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            isLoading={isLoading}
            error={loadError}
          />
        ))}
      </section>

      <div className="order-history-page__content">
        <SectionCard
          id="history-list"
          title="Tarix yozuvlari"
          description="Sana, stol va buyurtma raqami bo'yicha tarixiy yozuvlarni tekshiring."
        >
          <HistoryFilters
            filters={filters}
            tables={tables}
            searchTerm={searchTerm}
            isLoading={isLoading || isReferenceLoading}
            onFilterChange={handleFilterChange}
            onSearchChange={setSearchTerm}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />

          {referenceError ? (
            <p className="history-reference-error">{referenceError}</p>
          ) : null}

          <HistoryTable
            records={visibleRecords}
            staffById={staffById}
            tablesById={tablesById}
            isLoading={isLoading}
            error={loadError}
          />
        </SectionCard>

        <div className="order-history-page__side">
          <SectionCard
            id="history-iterator"
            title="Iterator traversal natijalari"
            description="Iterator andozasi orqali tarix yozuvlari ketma-ket o'qiladi."
          >
            <IteratorInfoCard
              records={iteratorRecords}
              isLoading={isIteratorLoading}
              error={iteratorError}
            />
          </SectionCard>

          <SectionCard
            id="history-popular"
            title="Eng mashhur menyu mahsuloti"
            description="Buyurtmalar tarixi ichidagi eng ko'p buyurtma qilingan mahsulot."
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
                title="Hali ma'lumot yo'q"
                description="Tarix yozuvlari shakllanganda eng mashhur mahsulot shu yerda ko'rinadi."
              />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

export default OrderHistory
