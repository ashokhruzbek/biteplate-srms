import { Fragment, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronRight, Clock, Menu } from 'lucide-react'
import UserMenu from './UserMenu'
import {
  getActiveNavigationTitle,
  getNavigationBreadcrumb,
} from '../../utils/navigation'

function getCurrentTime() {
  return new Intl.DateTimeFormat('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

function TopNavbar({ onMenuClick }) {
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(getCurrentTime)
  const breadcrumb = getNavigationBreadcrumb(location.pathname)
  const activeTitle = getActiveNavigationTitle(location.pathname)

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

        <div className="top-navbar__heading">
          <nav className="top-navbar__breadcrumb" aria-label="Joriy sahifa">
            <span className="top-navbar__crumb-root">BitePlate</span>
            {breadcrumb.map((item) => (
              <Fragment key={item}>
                <ChevronRight
                  className="top-navbar__crumb-sep"
                  size={14}
                  aria-hidden="true"
                />
                <span className="top-navbar__crumb">{item}</span>
              </Fragment>
            ))}
          </nav>
          <h1 className="top-navbar__title">{activeTitle}</h1>
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
        <UserMenu />
      </div>
    </header>
  )
}

export default TopNavbar
