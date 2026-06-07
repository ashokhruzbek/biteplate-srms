import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Table2,
  UsersRound,
  Utensils,
} from 'lucide-react'

export const navigationSections = [
  {
    id: 'overview',
    label: 'Umumiy',
    items: [
      {
        label: 'Dashboard',
        path: '/',
        icon: BarChart3,
      },
    ],
  },
  {
    id: 'management',
    label: 'Boshqaruv',
    items: [
      {
        label: 'Xodimlar',
        path: '/staff',
        icon: UsersRound,
        children: [
          { label: "Xodimlar ro'yxati", path: '/staff' },
          { label: "Xodim qo'shish", path: '/staff/create' },
        ],
      },
      {
        label: 'Stollar',
        path: '/tables',
        icon: Table2,
        children: [
          { label: "Stol ro'yxati", path: '/tables' },
          { label: "Stol qo'shish", path: '/tables/create' },
        ],
      },
      {
        label: 'Menyu',
        path: '/menu',
        icon: Utensils,
        children: [
          { label: "Menyular ro'yxati", path: '/menu' },
          { label: "Taom qo'shish", path: '/menu/create' },
          { label: 'Taomni moslashtirish', path: '/menu/customize' },
        ],
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operatsiyalar',
    items: [
      {
        label: 'Buyurtmalar',
        path: '/orders',
        icon: ClipboardList,
        children: [
          { label: "Buyurtmalar ro'yxati", path: '/orders' },
          { label: 'Buyurtma yaratish', path: '/orders/create' },
          { label: 'Billing', path: '/orders/billing' },
        ],
      },
      {
        label: 'Buyurtmalar tarixi',
        path: '/order-history',
        icon: CalendarDays,
        children: [
          { label: 'Tarix', path: '/order-history' },
          { label: 'Popular taom', path: '/order-history/popular' },
          { label: "Iterator ko'rish", path: '/order-history/iterator' },
        ],
      },
    ],
  },
]

export const navigationItems = navigationSections.flatMap(
  (section) => section.items,
)

function matchesPath(itemPath, pathname) {
  if (itemPath === '/') {
    return pathname === '/'
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`)
}

export function getNavigationMatch(pathname) {
  let parent = null

  for (const item of navigationItems) {
    if (matchesPath(item.path, pathname)) {
      if (!parent || item.path.length > parent.path.length) {
        parent = item
      }
    }
  }

  const child = parent?.children?.find((item) => item.path === pathname)

  return { parent, child }
}

export function getNavigationBreadcrumb(pathname) {
  const { parent, child } = getNavigationMatch(pathname)

  if (!parent) {
    return ['Dashboard']
  }

  return child && child.label !== parent.label
    ? [parent.label, child.label]
    : [parent.label]
}

export function getActiveNavigationTitle(pathname) {
  const { parent, child } = getNavigationMatch(pathname)

  if (!parent) {
    return 'Dashboard'
  }

  return child ? child.label : parent.label
}

export function getDefaultOpenNavigationIds(pathname) {
  return navigationItems
    .filter((item) => item.children?.length && matchesPath(item.path, pathname))
    .map((item) => item.path)
}

export function isNavigationParentActive(item, pathname) {
  return matchesPath(item.path, pathname)
}

export function isNavigationChildActive(child, pathname) {
  return child.path === pathname
}
