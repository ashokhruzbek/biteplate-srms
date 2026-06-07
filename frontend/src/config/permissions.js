/**
 * Role-based access — markaziy konfiguratsiya (single source of truth).
 *
 * MUHIM: Bu to'liq authentication tizimi EMAS. Bu faqat assignment doirasidagi
 * frontend role-based UI access simulyatsiyasi. JWT, login, sessions yo'q.
 */

export const ROLES = {
  MANAGER: 'MANAGER',
  WAITER: 'WAITER',
  CHEF: 'CHEF',
  CASHIER: 'CASHIER',
}

export const ROLE_LIST = Object.values(ROLES)

const ALL_ROLES = ROLE_LIST

/** Har bir rol uchun ko'rinish ma'lumotlari (label + rang ohangi). */
export const ROLE_META = {
  MANAGER: { label: 'Menejer', tone: 'manager' },
  WAITER: { label: 'Ofitsiant', tone: 'waiter' },
  CHEF: { label: 'Oshpaz', tone: 'chef' },
  CASHIER: { label: 'Kassir', tone: 'cashier' },
}

/**
 * Route'larga kirish huquqlari: path -> ruxsat etilgan rollar.
 * Sidebar va ProtectedRoute shu konfiguratsiyadan foydalanadi.
 */
export const ROUTE_ACCESS = {
  '/': ALL_ROLES,

  '/staff': [ROLES.MANAGER],
  '/staff/create': [ROLES.MANAGER],

  '/tables': [ROLES.MANAGER, ROLES.WAITER],
  '/tables/create': [ROLES.MANAGER, ROLES.WAITER],

  '/menu': [ROLES.MANAGER, ROLES.WAITER],
  '/menu/create': [ROLES.MANAGER],
  '/menu/customize': [ROLES.MANAGER],

  '/orders': [ROLES.MANAGER, ROLES.WAITER, ROLES.CHEF],
  '/orders/create': [ROLES.MANAGER, ROLES.WAITER],
  '/orders/billing': [ROLES.MANAGER, ROLES.CASHIER],

  '/order-history': [ROLES.MANAGER, ROLES.CASHIER],
  '/order-history/popular': [ROLES.MANAGER, ROLES.CASHIER],
  '/order-history/iterator': [ROLES.MANAGER],
}

/**
 * Sahifa ichidagi amallar uchun huquqlar (page-level access).
 * Masalan: oshxona amallari, billing, buyurtma yaratish.
 */
export const FEATURE_ACCESS = {
  'order.create': [ROLES.MANAGER, ROLES.WAITER],
  'order.kitchen': [ROLES.MANAGER, ROLES.CHEF],
  'order.bill': [ROLES.MANAGER, ROLES.CASHIER],
}

/** Berilgan rol ushbu path'ga kira oladimi. */
export function canAccessRoute(role, pathname) {
  const allowed = ROUTE_ACCESS[pathname]

  // Konfiguratsiyada bo'lmagan path'lar hammaga ochiq (masalan, unauthorized).
  if (!allowed) {
    return true
  }

  return allowed.includes(role)
}

/** Berilgan rol ushbu amalni bajara oladimi. */
export function canUseFeature(role, feature) {
  const allowed = FEATURE_ACCESS[feature]

  if (!allowed) {
    return true
  }

  return allowed.includes(role)
}
