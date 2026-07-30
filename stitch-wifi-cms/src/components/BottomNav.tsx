import { NavLink, useLocation } from 'react-router-dom'

const mobileNavItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/customers', icon: 'person', label: 'Customers' },
  { to: '/billing', icon: 'receipt', label: 'Billing' },
  { to: '/profile', icon: 'account_circle', label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-surface border-t border-outline-variant shadow-lg md:hidden px-2">
      {mobileNavItems.map((item) => {
        const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-colors ${
              isActive
                ? 'text-primary font-bold bg-primary-container/10'
                : 'text-on-surface-variant'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-medium">{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
