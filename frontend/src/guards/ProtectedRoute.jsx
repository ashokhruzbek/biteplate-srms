import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Unauthorized from '../pages/Unauthorized'

/**
 * Role-based route guard (auth allaqachon RequireAuth orqali tekshirilgan).
 *
 * - `allowedRoles` berilsa, o'sha ro'yxat bo'yicha tekshiradi.
 * - Berilmasa, joriy path uchun permissions konfiguratsiyasidan foydalanadi.
 *
 * Ruxsat bo'lmasa, professional Unauthorized sahifasini ko'rsatadi.
 */
function ProtectedRoute({ allowedRoles, children }) {
  const { currentRole, canAccess } = useAuth()
  const location = useLocation()

  const isAllowed = allowedRoles
    ? allowedRoles.includes(currentRole)
    : canAccess(location.pathname)

  if (!isAllowed) {
    return <Unauthorized />
  }

  return children
}

export default ProtectedRoute
