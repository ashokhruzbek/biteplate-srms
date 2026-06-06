import { Search } from 'lucide-react'

const filterOptions = [
  { value: 'ALL', label: 'Barchasi' },
  { value: 'FREE', label: 'Bo‘sh' },
  { value: 'OCCUPIED', label: 'Band' },
  { value: 'RESERVED', label: 'Rezerv' },
]

function TableFilters({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}) {
  return (
    <div className="table-filters">
      <label className="table-search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Stol raqami bo‘yicha qidirish"
        />
      </label>

      <div className="table-filter-tabs" aria-label="Stol holati filterlari">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              selectedStatus === option.value
                ? 'table-filter-tab table-filter-tab--active'
                : 'table-filter-tab'
            }
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TableFilters
