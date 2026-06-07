import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import IteratorInfoCard from '../../components/history/IteratorInfoCard'
import SectionCard from '../../components/ui/SectionCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getIteratorHistoryRecords } from '../../services/orderHistoryService'

function IteratorPage() {
  const {
    data: iteratorRecords,
    isLoading,
    error,
  } = useAsyncData(getIteratorHistoryRecords, { initialData: [] })

  return (
    <div className="page page--narrow">
      <PageHeader
        eyebrow="Buyurtmalar tarixi"
        title="Iterator ko‘rish"
        description="Iterator andozasi orqali tarix yozuvlari ketma-ket o‘qiladi."
        actions={
          <Link to="/order-history" className="secondary-button">
            <ArrowLeft size={16} aria-hidden="true" />
            Tarixga qaytish
          </Link>
        }
      />

      <SectionCard
        title="Iterator traversal natijalari"
        description="Iterator pattern yordamida tarix yozuvlarini ketma-ket o‘qish."
      >
        <IteratorInfoCard
          records={iteratorRecords}
          isLoading={isLoading}
          error={error}
        />
      </SectionCard>
    </div>
  )
}

export default IteratorPage
