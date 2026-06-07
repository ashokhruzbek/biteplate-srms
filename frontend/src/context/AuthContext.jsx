import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { login as loginRequest } from '../services/authService'
import { canAccessRoute, canUseFeature } from '../config/permissions'

/**
 * Lightweight staff authentication.
 *
 * MUHIM: Bu to'liq enterprise auth EMAS. JWT, refresh token, session
 * management yo'q. Foydalanuvchi ma'lumoti localStorage'da saqlanadi va
 * sahifa yangilanganda ham qoladi.
 */
const AuthContext = createContext(null)

const STORAGE_KEY = 'biteplate.auth.user'

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(readStoredUser)

  const login = useCallback(async (phoneNumber, password) => {
    try {
      const user = await loginRequest(phoneNumber, password)

      setCurrentUser(user)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

      return { ok: true, user }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(() => {
    const currentRole = currentUser?.role || null

    return {
      currentUser,
      isAuthenticated: Boolean(currentUser),
      currentRole,
      login,
      logout,
      canAccess: (pathname) =>
        currentRole ? canAccessRoute(currentRole, pathname) : false,
      can: (feature) => (currentRole ? canUseFeature(currentRole, feature) : false),
    }
  }, [currentUser, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth faqat AuthProvider ichida ishlatilishi kerak')
  }

  return context
}

export default AuthContext
