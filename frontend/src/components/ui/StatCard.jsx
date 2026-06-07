import Skeleton from './Skeleton'

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading = false,
  error = '',
  fallback = '--',
}) {
  const displayValue = error ? fallback : value ?? fallback

  return (
    <article className="stat-card">
      <div className="stat-card__icon" aria-hidden="true">
        {Icon ? <Icon size={22} strokeWidth={2} /> : null}
      </div>
      <div className="stat-card__content">
        <span>{title}</span>
        {isLoading ? (
          <Skeleton variant="line" width="60%" height="26px" />
        ) : (
          <strong>{displayValue}</strong>
        )}
        {error ? <p>{error}</p> : null}
      </div>
    </article>
  )
}

export default StatCard
