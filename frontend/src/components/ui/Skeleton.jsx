/**
 * Premium skeleton loader primitivi.
 * Variant: 'line' (matn), 'block' (karta/kataklar), 'circle' (ikonka/avatar).
 */
function Skeleton({ variant = 'line', width, height, radius, className = '' }) {
  const style = {
    width,
    height,
    borderRadius: radius,
  }

  return (
    <span
      className={`skeleton skeleton--${variant} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  )
}

/** Jadval uchun skeleton qatorlari. */
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div
      className="skeleton-table"
      style={{ '--skeleton-columns': columns }}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Yuklanmoqda</span>
      <div className="skeleton-table__row skeleton-table__row--head">
        {Array.from({ length: columns }).map((_, columnIndex) => (
          <Skeleton key={columnIndex} variant="line" width="60%" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div className="skeleton-table__row" key={rowIndex}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <Skeleton
              key={columnIndex}
              variant="line"
              width={columnIndex === 0 ? '80%' : '55%'}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Kartalar gridi uchun skeleton. */
export function CardSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-cards" role="status" aria-live="polite">
      <span className="sr-only">Yuklanmoqda</span>
      {Array.from({ length: count }).map((_, cardIndex) => (
        <div className="skeleton-cards__item" key={cardIndex}>
          <div className="skeleton-cards__top">
            <Skeleton variant="circle" width="38px" height="38px" />
            <Skeleton variant="line" width="50%" />
          </div>
          <Skeleton variant="line" width="80%" />
          <Skeleton variant="line" width="40%" />
        </div>
      ))}
    </div>
  )
}

export default Skeleton
