import { Search } from 'lucide-react'

function HistoryFilters({
  filters,
  tables,
  searchTerm,
  isLoading,
  onFilterChange,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onApplyFilters()
  }

  return (
    <form className="history-filters" onSubmit={handleSubmit}>
      <div className="history-filters__grid">
        <label className="form-field">
          <span>Boshlanish sanasi</span>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => onFilterChange('startDate', event.target.value)}
            disabled={isLoading}
          />
        </label>

        <label className="form-field">
          <span>Tugash sanasi</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => onFilterChange('endDate', event.target.value)}
            disabled={isLoading}
          />
        </label>

        <label className="form-field">
          <span>Stol bo‘yicha</span>
          <select
            value={filters.tableId}
            onChange={(event) => onFilterChange('tableId', event.target.value)}
            disabled={isLoading}
          >
            <option value="">Barcha stollar</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                Stol {table.tableNumber}
              </option>
            ))}
          </select>
        </label>

        <label className="history-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buyurtma raqami bo‘yicha qidirish"
          />
        </label>
      </div>

      <div className="history-filters__actions">
        <button type="submit" className="primary-button" disabled={isLoading}>
          Filterlash
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={onClearFilters}
          disabled={isLoading}
        >
          Tozalash
        </button>
      </div>
    </form>
  )
}

export default HistoryFilters
