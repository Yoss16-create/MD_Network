import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/customers', icon: 'group', label: 'Pelanggan' },
  { to: '/billing', icon: 'receipt_long', label: 'Tagihan' },
  { to: '/payments', icon: 'payments', label: 'Pembayaran' },
  { to: '/financial', icon: 'account_balance_wallet', label: 'Keuangan' },
  { to: '/reminders', icon: 'campaign', label: 'Pengingat' },
  { to: '/profile', icon: 'account_circle', label: 'Profil' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] hidden md:flex flex-col bg-slate-900 text-white shadow-xl z-50">

      <div className="p-5">

        <div className="flex items-center gap-3 mb-8">
          <img
            src="/logo.png"
            alt="MD_Network"
            className="w-10 h-10 rounded-xl bg-white p-1"
          />

          <div>
            <h1 className="text-sm font-bold text-cyan-400">
              MD_Network
            </h1>
            <p className="text-[11px] text-slate-400">
              Admin Console
            </p>
          </div>
        </div>


        <nav className="space-y-1">

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >

              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.label}
              </span>

            </NavLink>
          ))}

        </nav>

      </div>


      <div className="mt-auto p-4 border-t border-slate-700">

        <button
          onClick={() => navigate('/billing')}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-xl text-sm font-bold mb-3 shadow-lg"
        >
          + Invoice Baru
        </button>


        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">
            logout
          </span>

          Logout
        </button>

      </div>

    </aside>
  )
}