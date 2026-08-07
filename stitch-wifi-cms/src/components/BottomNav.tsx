import { NavLink } from 'react-router-dom'

const menu = [
  { to: '/', icon: 'dashboard', label: 'Home' },
  { to: '/customers', icon: 'group', label: 'Pelanggan' },
  { to: '/billing', icon: 'receipt_long', label: 'Tagihan' },
  { to: '/payments', icon: 'payments', label: 'Bayar' },
  { to: '/financial', icon: 'account_balance_wallet', label: 'Keuangan' },
  { to: '/reminders', icon: 'notifications', label: 'Pengingat' },
  { to: '/profile', icon: 'account_circle', label: 'Profil' },
]

export default function BottomNav() {
  return (
    <div
      className="
      fixed
      bottom-0
      left-0
      right-0
      md:hidden
      bg-white
      border-t
      border-slate-200
      shadow-lg
      h-[62px]
      z-[9999]
      "
    >

      <div className="
        grid
        grid-cols-7
        h-full
        items-center
      ">

        {menu.map((item) => (

          <NavLink
            key={item.to}
            to={item.to}
            className={({isActive}) =>
              `
              flex
              flex-col
              items-center
              justify-center
              gap-[2px]
              transition
              ${
                isActive
                ? 'text-blue-600'
                : 'text-slate-400'
              }
              `
            }
          >

            <span className="
              material-symbols-outlined
              text-[20px]
            ">
              {item.icon}
            </span>

            <span className="
              text-[9px]
              text-center
              leading-none
              whitespace-nowrap
            ">
              {item.label}
            </span>

          </NavLink>

        ))}

      </div>

    </div>
  )
}