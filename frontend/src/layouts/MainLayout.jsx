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
  }, [location.pathname])

  useEffect(() => {
    const contentElement = contentRef.current

    if (!contentElement) {
      return
    }

    contentElement.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

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
