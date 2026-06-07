import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AXIS_TICK, CHART_COLORS, TOOLTIP_STYLE } from './chartTheme'

function WeeklyOrdersTrendChart({ data = [] }) {
  return (
    <div className="dashboard-chart__canvas">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
          />
          <YAxis
            allowDecimals={false}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ stroke: CHART_COLORS.muted, strokeDasharray: '4 4' }}
            labelStyle={{ fontWeight: 700, color: '#0f1a16' }}
            formatter={(value) => [value, 'Buyurtmalar']}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke={CHART_COLORS.primary}
            strokeWidth={2.5}
            dot={{ r: 3, fill: CHART_COLORS.primary, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeeklyOrdersTrendChart
