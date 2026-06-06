import StatCard from '../ui/StatCard'

function HistoryStatCard({ title, value, icon, isLoading, error }) {
  return (
    <StatCard
      title={title}
      value={value}
      icon={icon}
      isLoading={isLoading}
      error={error}
    />
  )
}

export default HistoryStatCard
