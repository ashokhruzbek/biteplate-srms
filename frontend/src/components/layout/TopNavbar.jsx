import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Clock, Menu } from 'lucide-react'
import { getNavigationBreadcrumb } from '../../utils/navigation'

function getCurrentTime() {
  return new Intl.DateTimeFormat('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

function TopNavbar({ onMenuClick }) {
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(getCurrentTime)
  const breadcrumb = getNavigationBreadcrumb(location.pathname, location.hash)

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 60000)

    return () => window.clearInterval(timerId)
  }, [])

  return (
    <header className="top-navbar">
      <div className="top-navbar__left">
        <button
          type="button"
          className="top-navbar__menu-button"
          aria-label="Yon menyuni ochish"
          onClick={onMenuClick}
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        <div>
          <span className="top-navbar__label">BitePlate SRMS</span>
          <nav className="top-navbar__breadcrumb" aria-label="Joriy sahifa">
            {breadcrumb.map((item, index) => (
              <span key={item}>
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {item}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="top-navbar__actions">
        <span className="top-navbar__status">
          <span aria-hidden="true" />
          Tizim faol
        </span>
        <strong className="top-navbar__current">
          <Clock size={15} aria-hidden="true" />
          {currentTime}
        </strong>
      </div>
    </header>
  )
}

export default TopNavbar
