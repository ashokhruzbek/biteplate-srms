function AvailabilityBadge({ available }) {
  return (
    <span
      className={
        available
          ? 'availability-badge availability-badge--available'
          : 'availability-badge availability-badge--unavailable'
      }
    >
      {available ? 'Mavjud' : 'Mavjud emas'}
    </span>
  )
}

export default AvailabilityBadge
