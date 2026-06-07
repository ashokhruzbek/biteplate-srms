import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Sparkles,
  Table2,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import HistoryFilters from '../../components/history/HistoryFilters'
import HistoryStatCard from '../../components/history/HistoryStatCard'
import HistoryTable from '../../components/history/HistoryTable'
import SectionCard from '../../components/ui/SectionCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  getOrderHistory,
  getOrderHistoryByTable,
} from '../../services/orderHistoryService'
import { getAllStaff } from '../../services/staffService'
import { getTables } from '../../services/tableService'
import { formatCurrency, formatOrderNumber } from '../../utils/formatters'

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

function getFilterError(filters) {
  if (
    (filters.startDate && !filters.endDate) ||
    (!filters.startDate && filters.endDate)
  ) {
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

function OrderHistoryPage() {
  const {
    data: historyRecords,
    setData: setHistoryRecords,
    isLoading,
    error: loadErrorState,
  } = useAsyncData(() => getOrderHistory(), { initialData: [] })

  const { data: tables } = useAsyncData(getTables, { initialData: [] })
  const { data: staff } = useAsyncData(getAllStaff, { initialData: [] })

  const [filters, setFilters] = useState(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters)
  const [searchTerm, setSearchTerm] = useState('')
  const [loadError, setLoadError] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)

  const effectiveError = loadError || loadErrorState

  const staffById = useMemo(() => {
    return new Map(staff.map((member) => [Number(member.id), member]))
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

        return (
          Number(getRecordTableId(record)) === Number(appliedFilters.tableId)
        )
      })
      .filter((record) => isInsideDateRange(record, appliedFilters))
      .filter((record) => {
        if (!normalizedSearch) {
          return true
        }

        const rawOrderNumber =
          record.orderNumber ||
          record.order?.orderNumber ||
          record.orderId ||
          record.id
        const shortOrderNumber = formatOrderNumber(record)

        return (
          String(rawOrderNumber || '')
            .toLowerCase()
            .includes(normalizedSearch) ||
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
  const todayOrders = visibleRecords.filter((record) =>
    isToday(getRecordDate(record)),
  )

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
    { title: 'Unikal stollar', value: uniqueTableCount, icon: Table2 },
    {
      title: "O'rtacha summa",
      value: getAverageAmount(visibleRecords),
      icon: BarChart3,
    },
  ]

  async function loadFiltered(nextFilters) {
    setIsFiltering(true)
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
      setIsFiltering(false)
    }
  }

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
    await loadFiltered(filters)
  }

  async function handleClearFilters() {
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setSearchTerm('')
    await loadFiltered(emptyFilters)
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Buyurtmalar tarixi"
        title="Tarix"
        description="Singleton tarix jurnali bo‘yicha buyurtmalarni sana va stol kesimida tahlil qiling."
        actions={
          <div className="page-header__actions-group">
            <Link to="/order-history/popular" className="secondary-button">
              <Sparkles size={16} aria-hidden="true" />
              Popular taom
            </Link>
          </div>
        }
      />

      <section className="stats-grid" aria-label="Tarix statistikasi">
        {stats.map((stat) => (
          <HistoryStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            isLoading={isLoading || isFiltering}
            error={effectiveError}
          />
        ))}
      </section>

      <SectionCard
        title="Tarix yozuvlari"
        description="Sana, stol va buyurtma raqami bo‘yicha tarixiy yozuvlarni tekshiring."
      >
        <HistoryFilters
          filters={filters}
          tables={tables}
          searchTerm={searchTerm}
          isLoading={isLoading || isFiltering}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchTerm}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        <HistoryTable
          records={visibleRecords}
          staffById={staffById}
          tablesById={tablesById}
          isLoading={isLoading || isFiltering}
          error={effectiveError}
        />
      </SectionCard>
    </div>
  )
}

export default OrderHistoryPage
