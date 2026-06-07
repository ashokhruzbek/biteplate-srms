import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, CircleCheck, CircleX, Plus, Table2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import TableCard from '../../components/tables/TableCard'
import TableFilters from '../../components/tables/TableFilters'
import EmptyState from '../../components/ui/EmptyState'
import { CardSkeleton } from '../../components/ui/Skeleton'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getAllTables, updateTableStatus } from '../../services/tableService'

function getTableCounts(tables) {
  return tables.reduce(
    (counts, table) => {
      const status = String(table.status || 'FREE').toUpperCase()

      if (status === 'FREE') counts.free += 1
      if (status === 'OCCUPIED') counts.occupied += 1
      if (status === 'RESERVED') counts.reserved += 1

      return counts
    },
    { free: 0, occupied: 0, reserved: 0 },
  )
}

function TablesListPage() {
  const {
    data: tables,
    setData: setTables,
    isLoading,
    error: loadError,
  } = useAsyncData(getAllTables, { initialData: [] })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [statusError, setStatusError] = useState('')
  const [updatingTableId, setUpdatingTableId] = useState(null)

  const tableCounts = getTableCounts(tables)

  const filteredTables = useMemo(() => {
    const normalizedSearch = searchTerm.trim()

    return [...tables]
      .sort(
        (firstTable, secondTable) =>
          Number(firstTable.tableNumber) - Number(secondTable.tableNumber),
      )
      .filter((table) => {
        const status = String(table.status || 'FREE').toUpperCase()
        const matchesStatus =
          selectedStatus === 'ALL' || status === selectedStatus
        const matchesSearch =
          !normalizedSearch ||
          String(table.tableNumber || '').includes(normalizedSearch)

        return matchesStatus && matchesSearch
      })
  }, [tables, searchTerm, selectedStatus])

  const stats = [
    { title: 'Jami stollar', value: tables.length, icon: Table2 },
    { title: 'Bo‘sh stollar', value: tableCounts.free, icon: CircleCheck },
    { title: 'Band stollar', value: tableCounts.occupied, icon: CircleX },
    { title: 'Rezerv stollar', value: tableCounts.reserved, icon: CalendarDays },
  ]

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
    <div className="page">
      <PageHeader
        eyebrow="Stollar"
        title="Stol ro‘yxati"
        description="Restoran zali stollarini POS uslubida ko‘ring va holatini boshqaring."
        actions={
          <Link to="/tables/create" className="primary-button">
            <Plus size={16} aria-hidden="true" />
            Stol qo‘shish
          </Link>
        }
      />

      <section className="stats-grid" aria-label="Stollar statistikasi">
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
        title="Stollar holati"
        description="Stollarni filtrlang va holatini tez o‘zgartiring."
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
          <CardSkeleton count={6} />
        ) : loadError ? (
          <EmptyState
            icon={Table2}
            title="Stollar yuklanmadi"
            description={loadError}
          />
        ) : filteredTables.length === 0 ? (
          <EmptyState
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
  )
}

export default TablesListPage
