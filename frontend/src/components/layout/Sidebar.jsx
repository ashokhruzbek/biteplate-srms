import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BadgeCheck, ChevronDown, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getDefaultOpenNavigationIds,
  isNavigationChildActive,
  isNavigationParentActive,
  navigationSections,
} from '../../utils/navigation'

function getGroupId(path) {
  return `sidebar-group-${path === '/' ? 'dashboard' : path.replace(/\W/g, '-')}`
}

/**
 * Joriy rolga ko'ra navigatsiyani filtrlaydi.
 * - childless item: path'ga ruxsat bo'lsa ko'rinadi.
 * - group: o'zi yoki kamida bitta child'iga ruxsat bo'lsa ko'rinadi
 *   (faqat ruxsat etilgan child'lar render qilinadi).
 * - bo'sh section'lar yashiriladi.
 */
function getVisibleSections(canAccess) {
  return navigationSections
    .map((section) => {
      const items = section.items
        .map((item) => {
          if (!item.children?.length) {
            return canAccess(item.path) ? item : null
          }

          const children = item.children.filter((child) =>
            canAccess(child.path),
          )

          if (!canAccess(item.path) && children.length === 0) {
            return null
          }

          return { ...item, children }
        })
        .filter(Boolean)

      return { ...section, items }
    })
    .filter((section) => section.items.length > 0)
}

function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation()
  const { canAccess } = useAuth()
  const [openGroups, setOpenGroups] = useState(() =>
    getDefaultOpenNavigationIds(location.pathname),
  )

  useEffect(() => {
    const activeGroups = getDefaultOpenNavigationIds(location.pathname)

    if (activeGroups.length === 0) {
      return
    }

    setOpenGroups((currentGroups) => [
      ...new Set([...currentGroups, ...activeGroups]),
    ])
  }, [location.pathname])

  function toggleGroup(path) {
    setOpenGroups((currentGroups) =>
      currentGroups.includes(path)
        ? currentGroups.filter((groupPath) => groupPath !== path)
        : [...currentGroups, path],
    )
  }

  const visibleSections = getVisibleSections(canAccess)

  return (
    <>
      <button
        type="button"
        className={
          isOpen
            ? 'sidebar-overlay sidebar-overlay--visible'
            : 'sidebar-overlay'
        }
        aria-label="Yon menyuni yopish"
        onClick={onClose}
      />

      <aside
        className={isOpen ? 'sidebar sidebar--open' : 'sidebar'}
        aria-label="Asosiy navigatsiya"
      >
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark" aria-hidden="true">
            BP
          </div>
          <div className="sidebar__brand-copy">
            <strong>BitePlate</strong>
            <span>Restoran boshqaruvi</span>
          </div>
          <button
            type="button"
            className="sidebar__close"
            aria-label="Yon menyuni yopish"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Dashboard menyusi">
          {visibleSections.map((section) => (
            <div className="sidebar__section" key={section.id}>
              <p className="sidebar__section-label">{section.label}</p>

              {section.items.map((item) => {
                const Icon = item.icon
                const hasChildren = item.children?.length > 0

                if (!hasChildren) {
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        isActive
                          ? 'sidebar__link sidebar__link--active'
                          : 'sidebar__link'
                      }
                      onClick={onClose}
                    >
                      {Icon ? (
                        <span className="sidebar__icon-wrap" aria-hidden="true">
                          <Icon className="sidebar__icon" size={18} />
                        </span>
                      ) : null}
                      <span className="sidebar__label">{item.label}</span>
                    </NavLink>
                  )
                }

                const isExpanded = openGroups.includes(item.path)
                const isActive = isNavigationParentActive(
                  item,
                  location.pathname,
                )
                const groupId = getGroupId(item.path)

                return (
                  <div
                    key={item.path}
                    className={
                      isActive
                        ? 'sidebar__group sidebar__group--active'
                        : 'sidebar__group'
                    }
                  >
                    <button
                      type="button"
                      className={
                        isExpanded
                          ? 'sidebar__parent sidebar__parent--open'
                          : 'sidebar__parent'
                      }
                      aria-expanded={isExpanded}
                      aria-controls={groupId}
                      onClick={() => toggleGroup(item.path)}
                    >
                      {Icon ? (
                        <span className="sidebar__icon-wrap" aria-hidden="true">
                          <Icon className="sidebar__icon" size={18} />
                        </span>
                      ) : null}
                      <span className="sidebar__label">{item.label}</span>
                      <ChevronDown
                        className="sidebar__chevron"
                        size={16}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      className={
                        isExpanded
                          ? 'sidebar__submenu sidebar__submenu--open'
                          : 'sidebar__submenu'
                      }
                      id={groupId}
                    >
                      <div className="sidebar__submenu-inner">
                        {item.children.map((child) => {
                          const isChildActive = isNavigationChildActive(
                            child,
                            location.pathname,
                          )

                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={
                                isChildActive
                                  ? 'sidebar__submenu-link sidebar__submenu-link--active'
                                  : 'sidebar__submenu-link'
                              }
                              onClick={onClose}
                            >
                              <span
                                className="sidebar__submenu-dot"
                                aria-hidden="true"
                              />
                              <span>{child.label}</span>
                            </NavLink>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <span className="sidebar__footer-icon" aria-hidden="true">
            <BadgeCheck size={16} />
          </span>
          <div className="sidebar__footer-copy">
            <strong>shoxruzbek</strong>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
