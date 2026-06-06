const tableStatusLabels = {
  FREE: 'Bo‘sh',
  OCCUPIED: 'Band',
  RESERVED: 'Rezerv',
  AWAITING_BILL: 'Hisob kutilmoqda',
  CLEARED: 'Tozalangan',
}

function TableStatusBadge({ status }) {
  const normalizedStatus = String(status || 'FREE').toUpperCase()

  return (
    <span className={`table-status-badge table-status-badge--${normalizedStatus.toLowerCase()}`}>
      {tableStatusLabels[normalizedStatus] || 'Nomaʼlum'}
    </span>
  )
}

export default TableStatusBadge
