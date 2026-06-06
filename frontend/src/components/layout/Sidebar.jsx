import { NavLink } from 'react-router-dom'
import { navigationItems } from '../../utils/navigation'

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark" aria-hidden="true">
          BP
        </div>
        <div>
          <strong>BitePlate</strong>
          <span>Restoran boshqaruvi</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
