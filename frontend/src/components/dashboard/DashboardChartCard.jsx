import DashboardSection from './DashboardSection'
import LoadingSpinner from '../ui/LoadingSpinner'

/**
 * Chart kartasi: sarlavha + loading / empty / chart holatlari.
 */
function DashboardChartCard({
  title,
  description,
  isLoading = false,
  isEmpty = false,
  emptyLabel = 'Hozircha maʼlumot yo‘q.',
  children,
}) {
  return (
    <DashboardSection title={title} description={description}>
      {isLoading ? (
        <div className="dashboard-chart__state">
          <LoadingSpinner label="Yuklanmoqda" />
        </div>
      ) : isEmpty ? (
        <div className="dashboard-chart__state dashboard-chart__state--empty">
          {emptyLabel}
        </div>
      ) : (
        children
      )}
    </DashboardSection>
  )
}

export default DashboardChartCard
