import { useLocation } from 'react-router-dom'
import { getNavigationItemByPath } from '../../utils/navigation'

function TopNavbar() {
  const location = useLocation()
  const currentPage = getNavigationItemByPath(location.pathname)

  return (
    <header className="top-navbar">
      <div>
        <span className="top-navbar__label">BitePlate SRMS</span>
        <p>Aqlli restoran boshqaruv tizimi</p>
      </div>
      <strong className="top-navbar__current">
        {currentPage?.label || 'Boshqaruv paneli'}
      </strong>
    </header>
  )
}

export default TopNavbar
