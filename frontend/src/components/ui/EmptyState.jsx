import { Inbox } from 'lucide-react'

function EmptyState({
  icon: Icon = Inbox,
  title = 'Maʼlumot yo‘q',
  description = 'Hozircha ko‘rsatish uchun maʼlumot mavjud emas.',
  action = null,
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        <Icon size={24} strokeWidth={1.8} />
      </span>
      <div className="empty-state__copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  )
}

export default EmptyState
