import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export default function TopAppBar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { customers } = useData()
  const pendingCount = customers.filter(c => ['Belum Bayar', 'Jatuh Tempo', 'Nunggak'].includes(c.status)).length
  return (
    <header className="flex justify-between items-center h-16 px-6 bg-surface border-b border-outline-variant sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-grow max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-[14px] outline-none"
            placeholder="Cari pelanggan atau invoice..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <button onClick={() => navigate('/reminders')} className="p-2 hover:bg-surface-container-highest rounded-full transition-transform active:scale-90 relative">
          <span className="material-symbols-outlined text-secondary">notifications</span>
          {pendingCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-surface">
              {pendingCount}
            </span>
          )}
        </button>
        <button className="p-2 hover:bg-surface-container-highest rounded-full transition-transform active:scale-90">
          <span className="material-symbols-outlined text-secondary">help_outline</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant mx-1"></div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-highest p-1 rounded-full pr-3 transition-all">
          <img
            className="w-8 h-8 rounded-full border border-primary/20 object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGujT-UcfxoSqqkFYdS9Q_ZDcTkmJzP0bmXSRq3aKrQr6fA2EZcXjJMQutK-tQCZQbFX4EYFqegBpHKQKYs43GkBmRJAouzX6_ypcSLOnCUR7yuviwcwGhkoZxmDFl2GkYE6KKIPOQvKHbXnijdN71GS5oNArgIqPjkniAnZ_CpN1XS2yCP50mYntIuuNfG-rmbKFE7m0qyE3elL0kz8Pff3jHnZzzIw1sXwHwERtSc2faI9bgFt7SCg"
            alt="Admin"
          />
          <span className="text-[12px] font-semibold tracking-[0.05em] hidden lg:block">{user?.name || 'Admin ISP'}</span>
        </div>
      </div>
    </header>
  )
}
