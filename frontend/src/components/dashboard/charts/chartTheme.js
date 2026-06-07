// Recharts uchun umumiy tema — design system ranglariga mos, minimal va toza.

export const CHART_COLORS = {
  primary: '#1f6b54',
  info: '#285b78',
  warning: '#8a6420',
  danger: '#a23c2c',
  grid: '#e3e8e6',
  axis: '#97a29e',
  muted: '#c4cdc9',
}

// Stol bandligi donut bo'laklari ranglari (status bo'yicha)
export const TABLE_OCCUPANCY_COLORS = {
  free: '#2f9d6f',
  occupied: '#285b78',
  reserved: '#8a6420',
  other: '#c4cdc9',
}

// Holat bo'yicha bar ranglari
export const ORDER_STATUS_COLORS = {
  PENDING: '#8a6420',
  PREPARING: '#285b78',
  READY: '#2f9d6f',
  SERVED: '#1f6b54',
  CANCELLED: '#a23c2c',
}

export const AXIS_TICK = {
  fill: CHART_COLORS.axis,
  fontSize: 12,
  fontWeight: 600,
}

export const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid #e3e8e6',
  boxShadow: '0 12px 28px rgba(15, 26, 22, 0.1)',
  fontSize: 13,
  padding: '8px 12px',
}
