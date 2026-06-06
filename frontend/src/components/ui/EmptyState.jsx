import { Inbox } from 'lucide-react'

function EmptyState({
  icon: Icon = Inbox,
  title = 'Maʼlumot yo‘q',
  description = 'Hozircha ko‘rsatish uchun maʼlumot mavjud emas.',
}) {
  return (
    <div className="empty-state">
      <Icon className="empty-state__icon" aria-hidden="true" size={24} />
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default EmptyState
