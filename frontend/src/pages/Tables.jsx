import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CircleCheck, CircleX, Table2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import TableCard from '../components/tables/TableCard'
import TableFilters from '../components/tables/TableFilters'
import TableForm from '../components/tables/TableForm'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import {
  createTable,
  getAllTables,
  updateTableStatus,
} from '../services/tableService'

function getTableCounts(tables) {
  return tables.reduce(
    (counts, table) => {
      const status = String(table.status || 'FREE').toUpperCase()

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

function Tables() {
  const [tables, setTables] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  const [statusError, setStatusError] = useState('')
  const [updatingTableId, setUpdatingTableId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadTables() {
      setIsLoading(true)
      setLoadError('')

      try {
        const tableList = await getAllTables()

        if (isMounted) {
          setTables(tableList)
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

    loadTables()

    return () => {
      isMounted = false
    }
  }, [])

  const tableCounts = getTableCounts(tables)

  const filteredTables = useMemo(() => {
    const normalizedSearch = searchTerm.trim()

    return [...tables]
      .sort((firstTable, secondTable) => {
        return Number(firstTable.tableNumber) - Number(secondTable.tableNumber)
      })
      .filter((table) => {
        const status = String(table.status || 'FREE').toUpperCase()
        const matchesStatus = selectedStatus === 'ALL' || status === selectedStatus
        const matchesSearch =
          !normalizedSearch ||
          String(table.tableNumber || '').includes(normalizedSearch)

        return matchesStatus && matchesSearch
      })
  }, [tables, searchTerm, selectedStatus])

  const stats = [
    {
      title: 'Jami stollar',
      value: tables.length,
      icon: Table2,
    },
    {
      title: 'Bo‘sh stollar',
      value: tableCounts.free,
      icon: CircleCheck,
    },
    {
      title: 'Band stollar',
      value: tableCounts.occupied,
      icon: CircleX,
    },
    {
      title: 'Rezerv stollar',
      value: tableCounts.reserved,
      icon: CalendarDays,
    },
  ]

  async function handleCreateTable(tableData) {
    setCreateError('')
    setCreateSuccess('')
    setStatusError('')
    setIsCreating(true)

    try {
      const createdTable = await createTable(tableData)

      if (createdTable) {
        setTables((currentTables) => [createdTable, ...currentTables])
      }

      setCreateSuccess('Stol muvaffaqiyatli yaratildi.')
      return true
    } catch (error) {
      setCreateError(error.message)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  async function handleStatusChange(table, nextStatus) {
    const previousTables = tables

    setStatusError('')
    setUpdatingTableId(table.id)
    setTables((currentTables) =>
      currentTables.map((currentTable) =>
        currentTable.id === table.id
          ? { ...currentTable, status: nextStatus }
          : currentTable,
      ),
    )

    try {
      const updatedTable = await updateTableStatus(table.id, nextStatus)

      if (updatedTable) {
        setTables((currentTables) =>
          currentTables.map((currentTable) =>
            currentTable.id === updatedTable.id ? updatedTable : currentTable,
          ),
        )
      }
    } catch (error) {
      setTables(previousTables)
      setStatusError(error.message)
    } finally {
      setUpdatingTableId(null)
    }
  }

  return (
    <div className="tables-page">
      <PageHeader
        title="Stollar boshqaruvi"
        description="Restoran zali stollarini ko‘rish, yaratish va holatini tez boshqarish."
      />

      <section className="tables-stats" aria-label="Stollar statistikasi">
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

      <div className="tables-page__content">
        <SectionCard
          title="Yangi stol qo‘shish"
          description="Stol raqami va sig‘imini kiriting."
        >
          <TableForm
            onSubmit={handleCreateTable}
            isSubmitting={isCreating}
            submitError={createError}
            successMessage={createSuccess}
          />
        </SectionCard>

        <SectionCard
          title="Stollar holati"
          description="Stollarni POS uslubida ko‘ring va holatini tez o‘zgartiring."
        >
          <TableFilters
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            onSearchChange={setSearchTerm}
            onStatusChange={setSelectedStatus}
          />

          {statusError ? (
            <p className="tables-action-error">{statusError}</p>
          ) : null}

          {isLoading ? (
            <div className="tables-grid-feedback">
              <LoadingSpinner label="Stollar yuklanmoqda" />
            </div>
          ) : loadError ? (
            <EmptyState
              icon={Armchair}
              icon={Table2}
              title="Stollar yuklanmadi"
              description={loadError}
            />
          ) : filteredTables.length === 0 ? (
            <EmptyState
              icon={Armchair}
              icon={Table2}
              title="Stol topilmadi"
              description="Qidiruv yoki filter qiymatini o‘zgartirib ko‘ring."
            />
          ) : (
            <div className="tables-grid">
              {filteredTables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onStatusChange={handleStatusChange}
                  isUpdating={updatingTableId === table.id}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

export default Tables
