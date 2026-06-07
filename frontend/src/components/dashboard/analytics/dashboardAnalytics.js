// Dashboard uchun sof hisob-kitob funksiyalari (UI'dan ajratilgan).
// Barcha widget va chartlar shu yerdan foydalanadi.

const ORDER_STATUS_LABELS = {
  PENDING: 'Kutilmoqda',
  PREPARING: 'Tayyorlanmoqda',
  READY: 'Tayyor',
  SERVED: 'Yetkazildi',
  CANCELLED: 'Bekor qilingan',
}

const ORDER_STATUS_ORDER = [
  'PENDING',
  'PREPARING',
  'READY',
  'SERVED',
  'CANCELLED',
]

const WEEKDAY_LABELS = ['Yak', 'Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha']

export function isToday(value) {
  if (!value) {
    return false
  }

  const date = new Date(value)
  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export function sortByNewest(orders = []) {
  return [...orders].sort((firstOrder, secondOrder) => {
    const firstDate = new Date(firstOrder.createdAt).getTime() || 0
    const secondDate = new Date(secondOrder.createdAt).getTime() || 0
    return secondDate - firstDate
  })
}

export function getOrderStats(orders = []) {
  const stats = {
    total: orders.length,
    today: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    served: 0,
    cancelled: 0,
  }

  orders.forEach((order) => {
    if (isToday(order.createdAt)) {
      stats.today += 1
    }

    switch (order.status) {
      case 'PENDING':
        stats.pending += 1
        break
      case 'PREPARING':
        stats.preparing += 1
        break
      case 'READY':
        stats.ready += 1
        break
      case 'SERVED':
        stats.served += 1
        break
      case 'CANCELLED':
        stats.cancelled += 1
        break
      default:
        break
    }
  })

  return stats
}

export function getTableCounts(tables = []) {
  return tables.reduce(
    (counts, table) => {
      const status = String(table.status || 'FREE').toUpperCase()

      if (status === 'FREE') counts.free += 1
      else if (status === 'OCCUPIED') counts.occupied += 1
      else if (status === 'RESERVED') counts.reserved += 1
      else counts.other += 1

      return counts
    },
    { free: 0, occupied: 0, reserved: 0, other: 0 },
  )
}

// Oxirgi 7 kun bo'yicha buyurtmalar tendentsiyasi (LineChart uchun)
export function getWeeklyOrdersTrend(orders = []) {
  const days = []
  const today = new Date()

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    date.setHours(0, 0, 0, 0)

    days.push({
      key: date.toDateString(),
      label: WEEKDAY_LABELS[date.getDay()],
      orders: 0,
    })
  }

  const dayMap = new Map(days.map((day) => [day.key, day]))

  orders.forEach((order) => {
    if (!order.createdAt) return
    const date = new Date(order.createdAt)
    date.setHours(0, 0, 0, 0)
    const entry = dayMap.get(date.toDateString())
    if (entry) {
      entry.orders += 1
    }
  })

  return days
}

// Holat bo'yicha buyurtmalar (BarChart uchun)
export function getOrdersByStatus(orders = []) {
  const counts = orders.reduce((acc, order) => {
    const status = order.status || 'PENDING'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  return ORDER_STATUS_ORDER.map((status) => ({
    status,
    label: ORDER_STATUS_LABELS[status],
    count: counts[status] || 0,
  }))
}

// Stol bandligi taqsimoti (Donut uchun)
export function getTableOccupancy(tables = []) {
  const counts = getTableCounts(tables)

  return [
    { key: 'free', name: 'Bo‘sh', value: counts.free },
    { key: 'occupied', name: 'Band', value: counts.occupied },
    { key: 'reserved', name: 'Rezerv', value: counts.reserved },
    { key: 'other', name: 'Boshqa', value: counts.other },
  ].filter((slice) => slice.value > 0)
}

export function normalizePopularItem(popularItem) {
  const source = Array.isArray(popularItem) ? popularItem[0] : popularItem

  if (!source || typeof source !== 'object') {
    return null
  }

  return {
    menuItemId:
      source.menuItemId ||
      source.itemId ||
      source.id ||
      source.menu_item_id ||
      source.menuItem?.id,
    name:
      source.name ||
      source.menuItemName ||
      source.menuItem?.name ||
      source.popularItem?.name,
    totalQuantity:
      source.totalQuantity ||
      source.quantity ||
      source.totalOrdered ||
      source.count ||
      source._sum?.quantity ||
      0,
  }
}

export { ORDER_STATUS_LABELS }
