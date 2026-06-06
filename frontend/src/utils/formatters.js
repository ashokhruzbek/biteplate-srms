export function formatCurrency(value) {
  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return '--'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDateTime(value) {
  if (!value) {
    return '--'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatOrderNumber(order) {
  const rawOrderNumber =
    typeof order === 'object'
      ? order?.orderNumber || order?.order?.orderNumber
      : order
  const fallbackId =
    typeof order === 'object'
      ? order?.orderId || order?.order?.id || order?.id
      : undefined
  const digits = String(rawOrderNumber || '').match(/\d/g)?.join('')

  if (digits) {
    return `ORD-${digits.slice(-4).padStart(4, '0')}`
  }

  if (fallbackId) {
    return `ORD-${String(fallbackId).padStart(4, '0')}`
  }

  return '--'
}

export function formatRoleLabel(role) {
  const roleLabels = {
    MANAGER: 'Menejer',
    WAITER: 'Ofitsiant',
    CHEF: 'Oshpaz',
    CASHIER: 'Kassir',
  }

  return roleLabels[String(role || '').toUpperCase()] || 'Nomaʼlum'
}
