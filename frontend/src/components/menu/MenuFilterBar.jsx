import { Search } from 'lucide-react'

function MenuFilterBar({
  searchTerm,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
}) {
  return (
    <div className="menu-filter-bar">
      <label className="menu-search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Taom yoki kategoriya bo‘yicha qidirish"
        />
      </label>

      <div className="menu-category-tabs" aria-label="Kategoriya filterlari">
        <button
          type="button"
          className={selectedCategory === 'ALL' ? 'menu-tab menu-tab--active' : 'menu-tab'}
          onClick={() => onCategoryChange('ALL')}
        >
          Barchasi
        </button>

        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              selectedCategory === category ? 'menu-tab menu-tab--active' : 'menu-tab'
            }
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MenuFilterBar
