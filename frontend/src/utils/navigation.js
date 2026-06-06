import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Table2,
  UsersRound,
  Utensils,
} from 'lucide-react'

export const navigationItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: BarChart3,
  },
  {
    label: 'Xodimlar',
    path: '/staff',
    icon: UsersRound,
    children: [
      { label: "Xodimlar ro'yxati", path: '/staff#staff-list' },
      { label: "Xodim qo'shish", path: '/staff#staff-create' },
    ],
  },
  {
    label: 'Stollar',
    path: '/tables',
    icon: Table2,
    children: [
      { label: "Stol ro'yxati", path: '/tables#tables-list' },
      { label: 'Stol yaratish', path: '/tables#tables-create' },
    ],
  },
  {
    label: 'Menyu',
    path: '/menu',
    icon: Utensils,
    children: [
      { label: "Menyular ro'yxati", path: '/menu#menu-list' },
      { label: "Taom qo'shish", path: '/menu#menu-create' },
      { label: 'Taomni moslashtirish', path: '/menu#menu-customize' },
    ],
  },
  {
    label: 'Buyurtmalar',
    path: '/orders',
    icon: ClipboardList,
    children: [
      { label: "Buyurtmalar ro'yxati", path: '/orders#orders-list' },
      { label: 'Buyurtma yaratish', path: '/orders#orders-create' },
      { label: 'Billing', path: '/orders#orders-billing' },
    ],
  },
  {
    label: 'Buyurtmalar tarixi',
    path: '/order-history',
    icon: CalendarDays,
    children: [
      { label: 'Tarix', path: '/order-history#history-list' },
      { label: "Iterator ko'rish", path: '/order-history#history-iterator' },
      { label: 'Popular taom', path: '/order-history#history-popular' },
    ],
  },
]

export function getNavigationItemByPath(pathname) {
  return navigationItems.find((item) => item.path === pathname)
}

export function getNavigationMatch(pathname, hash = '') {
  const parent = getNavigationItemByPath(pathname)
  const fullPath = `${pathname}${hash}`
  const child = parent?.children?.find((item) => item.path === fullPath)

  return {
    parent,
    child,
  }
}

export function getNavigationBreadcrumb(pathname, hash = '') {
  const { parent, child } = getNavigationMatch(pathname, hash)

  if (!parent) {
    return ['Dashboard']
  }

  return child ? [parent.label, child.label] : [parent.label]
}

export function getDefaultOpenNavigationIds(pathname) {
  return navigationItems
    .filter((item) => item.children?.length && item.path === pathname)
    .map((item) => item.path)
}

export function isNavigationParentActive(item, pathname) {
  return item.path === pathname
}

export function isNavigationChildActive(child, pathname, hash = '') {
  return child.path === `${pathname}${hash}`
}
