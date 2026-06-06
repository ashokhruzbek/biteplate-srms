import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import TopNavbar from '../components/layout/TopNavbar'

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const contentRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const contentElement = contentRef.current

    if (!contentElement) {
      return
    }

    if (!location.hash) {
      contentElement.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.requestAnimationFrame(() => {
      const targetId = decodeURIComponent(location.hash.slice(1))
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }, [location.pathname, location.hash])

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="app-main">
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="app-content" ref={contentRef}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
