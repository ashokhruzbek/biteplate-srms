import LoadingSpinner from '../ui/LoadingSpinner'

function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isLoading,
  error,
}) {
  return (
    <article className="dashboard-stat-card">
      <div className="dashboard-stat-card__icon" aria-hidden="true">
        {Icon ? <Icon size={22} strokeWidth={2} /> : null}
      </div>
      <div className="dashboard-stat-card__content">
        <span>{title}</span>
        {isLoading ? (
          <LoadingSpinner label="Yuklanmoqda" />
        ) : (
          <strong>{error ? '--' : value}</strong>
        )}
        {subtitle ? <p>{subtitle}</p> : null}
        {error ? <p className="dashboard-stat-card__error">{error}</p> : null}
      </div>
    </article>
  )
}

export default DashboardStatCard
