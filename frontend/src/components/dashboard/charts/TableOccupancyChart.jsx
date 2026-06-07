import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  CHART_COLORS,
  TABLE_OCCUPANCY_COLORS,
  TOOLTIP_STYLE,
} from './chartTheme'

function TableOccupancyChart({ data = [] }) {
  return (
    <div className="dashboard-chart__canvas">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={TABLE_OCCUPANCY_COLORS[entry.key] || CHART_COLORS.muted}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [value, name]}
          />
          <Legend
            verticalAlign="bottom"
            height={28}
            iconType="circle"
            iconSize={9}
            formatter={(value) => (
              <span className="dashboard-chart__legend">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TableOccupancyChart
