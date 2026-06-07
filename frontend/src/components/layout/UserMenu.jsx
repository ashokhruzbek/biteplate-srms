import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_META } from '../../config/permissions'

function getInitials(fullName = '') {
  const parts = fullName.trim().split(/\s+/).slice(0, 2)
  const initials = parts.map((part) => part[0] || '').join('')
  return initials.toUpperCase() || 'U'
}

/** Top navbar foydalanuvchi bloki: ism, rol badge va logout. */
function UserMenu() {
  const navigate = useNavigate()
  const { currentUser, currentRole, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen])

  if (!currentUser) {
    return null
  }

  const meta = ROLE_META[currentRole]

  function handleLogout() {
    setIsOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        type="button"
        className="user-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="user-menu__avatar" aria-hidden="true">
          {getInitials(currentUser.fullName)}
        </span>
        <span className="user-menu__info">
          <strong className="user-menu__name">{currentUser.fullName}</strong>
          <span className={`user-menu__role user-menu__role--${meta?.tone}`}>
            {meta?.label || currentRole}
          </span>
        </span>
        <ChevronDown
          className={
            isOpen
              ? 'user-menu__chevron user-menu__chevron--open'
              : 'user-menu__chevron'
          }
          size={16}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div className="user-menu__dropdown" role="menu">
          <div className="user-menu__header">
            <span className="user-menu__avatar user-menu__avatar--lg" aria-hidden="true">
              {getInitials(currentUser.fullName)}
            </span>
            <div className="user-menu__header-copy">
              <strong>{currentUser.fullName}</strong>
              <span>{currentUser.phoneNumber}</span>
            </div>
          </div>

          <button
            type="button"
            className="user-menu__logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <LogOut size={16} aria-hidden="true" />
            Chiqish
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default UserMenu
