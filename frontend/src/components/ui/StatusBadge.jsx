const statusLabels = {
  PENDING: 'Kutilmoqda',
  PREPARING: 'Tayyorlanmoqda',
  READY: 'Tayyor',
  SERVED: 'Yetkazildi',
  CANCELLED: 'Bekor qilingan',
}

function StatusBadge({ status }) {
  const normalizedStatus = status ? String(status).toUpperCase() : 'UNKNOWN'
  const label = statusLabels[normalizedStatus] || 'Nomaʼlum'

  return (
    <span className={`status-badge status-badge--${normalizedStatus.toLowerCase()}`}>
      {label}
    </span>
  )
}

export default StatusBadge
