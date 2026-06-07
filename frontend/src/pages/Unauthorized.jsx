import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import SectionCard from '../components/ui/SectionCard'

function Unauthorized() {
  return (
    <div className="page page--narrow">
      <PageHeader
        eyebrow="Ruxsat yo‘q"
        title="Kirish cheklangan"
        description="Joriy rol bu sahifa uchun yetarli huquqqa ega emas."
      />

      <SectionCard title="403 · Ruxsat etilmagan">
        <EmptyState
          icon={ShieldAlert}
          title="Sizda ushbu sahifaga kirish huquqi mavjud emas."
          description="Iltimos, mos rolga ega foydalanuvchi bilan davom eting yoki dashboardga qayting."
          action={
            <Link to="/" className="primary-button">
              <ArrowLeft size={16} aria-hidden="true" />
              Dashboardga qaytish
            </Link>
          }
        />
      </SectionCard>
    </div>
  )
}

export default Unauthorized
