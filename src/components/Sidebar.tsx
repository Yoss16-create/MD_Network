import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', icon: 'dashboard', label: 'DASHBOARD' },
  { to: '/customers', icon: 'group', label: 'PELANGGAN' },
  { to: '/billing', icon: 'receipt_long', label: 'TAGIHAN' },
  { to: '/payments', icon: 'payments', label: 'PEMBAYARAN' },
  { to: '/financial', icon: 'account_balance_wallet', label: 'KEUANGAN' },
  { to: '/reminders', icon: 'campaign', label: 'PENGINGAT' },
  { to: '/profile', icon: 'account_circle', label: 'PROFIL' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] hidden md:flex flex-col bg-surface-container-lowest border-r border-outline-variant shadow-sm z-50">
      <div className="flex flex-col h-full py-6">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MD_Network Logo" className="w-10 h-10 rounded-lg object-contain" />
            <div>
              <h1 className="text-[20px] font-semibold text-primary leading-tight tracking-[-0.01em]">MD_Network</h1>
              <p className="text-[14px] text-secondary">Admin Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-primary-container/10 text-primary font-bold border-l-4 border-primary rounded-r-lg rounded-l-sm'
                    : 'text-secondary hover:bg-surface-container-low'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? '' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <span className="text-[12px] font-semibold tracking-[0.05em]">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="px-4 mt-auto border-t border-outline-variant pt-6">
          <button onClick={() => navigate('/billing')} className="w-full py-3 px-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all active:scale-95">
            <span className="material-symbols-outlined">add_circle</span>
            <span>New Invoice</span>
          </button>
          <div className="mt-4 space-y-1">
            <NavLink to="/settings" className="flex items-center gap-3 px-4 py-2 text-secondary hover:bg-surface-container-low transition-colors rounded-lg">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-[14px]">Settings</span>
            </NavLink>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/10 transition-colors rounded-lg">
              <span className="material-symbols-outlined">logout</span>
              <span className="text-[14px]">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
