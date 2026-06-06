import { GitBranch } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import LoadingSpinner from '../ui/LoadingSpinner'
import { formatCurrency, formatOrderNumber } from '../../utils/formatters'

function normalizeIteratorRecords(records) {
  if (Array.isArray(records)) {
    return records
  }

  if (Array.isArray(records?.records)) {
    return records.records
  }

  if (Array.isArray(records?.items)) {
    return records.items
  }

  return []
}

function IteratorInfoCard({ records, isLoading, error }) {
  const iteratorRecords = normalizeIteratorRecords(records).slice(0, 4)

  if (isLoading) {
    return (
      <div className="history-side-feedback">
        <LoadingSpinner label="Iterator natijalari yuklanmoqda" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={GitBranch}
        title="Iterator natijalari yuklanmadi"
        description={error}
      />
    )
  }

  if (iteratorRecords.length === 0) {
    return (
      <EmptyState
        icon={GitBranch}
        title="Iterator natijalari yo'q"
        description="Tarix yozuvlari mavjud bo'lganda traversal natijalari ko'rinadi."
      />
    )
  }

  return (
    <div className="iterator-card">
      <p>
        Tarix yozuvlari iterator orqali ketma-ket traversal qilinmoqda. Quyida
        traversal natijasidagi dastlabki yozuvlar ko'rsatilgan.
      </p>
      <div className="iterator-card__list">
        {iteratorRecords.map((record) => (
          <div key={`${record.id || record.orderId}-${record.timestamp || ''}`}>
            <strong>{formatOrderNumber(record)}</strong>
            <span>{formatCurrency(record.totalAmount || record.order?.totalAmount)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IteratorInfoCard
