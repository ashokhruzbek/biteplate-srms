export const navigationItems = [
  { label: 'Boshqaruv paneli', path: '/' },
  { label: 'Xodimlar', path: '/staff' },
  { label: 'Stollar', path: '/tables' },
  { label: 'Menyu', path: '/menu' },
  { label: 'Buyurtmalar', path: '/orders' },
  { label: 'Buyurtmalar tarixi', path: '/order-history' },
]

export function getNavigationItemByPath(pathname) {
  return navigationItems.find((item) => item.path === pathname)
}
