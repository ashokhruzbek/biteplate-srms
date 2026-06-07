import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Auth guard — login qilmagan foydalanuvchini /login sahifasiga yo'naltiradi.
 * Dashboard layout'ining tashqi qatlami sifatida ishlatiladi.
 */
function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default RequireAuth
