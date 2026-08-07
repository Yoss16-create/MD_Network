import { useNavigate } from "react-router-dom"
import { useData } from "../context/DataContext"

export default function QuickMenu() {

  const navigate = useNavigate()

  const { invoices } = useData()

  const unpaidCount = invoices.filter(
    invoice => invoice.status !== "Lunas"
  ).length

  // Sementara masih statis.
  // Nanti saat halaman Gangguan dibuat tinggal diganti dari DataContext.
  const troubleCount = 1

  const menus = [
    {
      title: "Pelanggan",
      icon: "groups",
      color: "bg-blue-100 text-blue-600",
      link: "/customers",
      badge: "",
    },
    {
      title: "Tagihan",
      icon: "receipt_long",
      color: "bg-orange-100 text-orange-600",
      link: "/billing",
      badge: unpaidCount > 0 ? unpaidCount.toString() : "",
    },
    {
      title: "Bayar",
      icon: "payments",
      color: "bg-green-100 text-green-600",
      link: "/payments",
      badge: "",
    },
    {
      title: "Gangguan",
      icon: "wifi_tethering_error",
      color: "bg-red-100 text-red-600",
      link: "/trouble",
      badge: troubleCount > 0 ? troubleCount.toString() : "",
    },
    {
      title: "Invoice",
      icon: "description",
      color: "bg-cyan-100 text-cyan-600",
      link: "/invoice",
      badge: "",
    },
    {
      title: "Laporan",
      icon: "analytics",
      color: "bg-purple-100 text-purple-600",
      link: "/reports",
      badge: "",
    },
    {
      title: "Profil",
      icon: "account_circle",
      color: "bg-indigo-100 text-indigo-600",
      link: "/profile",
      badge: "",
    },
    {
      title: "Setting",
      icon: "settings",
      color: "bg-gray-100 text-gray-700",
      link: "/settings",
      badge: "",
    },
  ]

  return (

    <div className="bg-white rounded-3xl shadow-xl p-5">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-lg font-bold text-gray-800">
          ⚡ Menu Cepat
        </h2>

        <span className="text-sm text-blue-600 font-semibold">
          Semua Menu
        </span>

      </div>

      <div className="grid grid-cols-4 gap-4">

        {menus.map((menu) => (

          <button
            key={menu.title}
            onClick={() => navigate(menu.link)}
            className="
              relative
              bg-gray-50
              rounded-2xl
              p-4
              hover:bg-white
              hover:shadow-lg
              active:scale-95
              transition-all
              duration-300
              border
              border-gray-100
            "
          >

            {menu.badge !== "" && (

              <div
                className="
                  absolute
                  -top-2
                  -right-2
                  w-6
                  h-6
                  rounded-full
                  bg-red-500
                  text-white
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-center
                  shadow
                "
              >
                {menu.badge}
              </div>

            )}

            <div
              className={`
                w-14
                h-14
                mx-auto
                rounded-full
                flex
                items-center
                justify-center
                ${menu.color}
              `}
            >

              <span className="material-symbols-outlined text-3xl">
                {menu.icon}
              </span>

            </div>

            <p className="mt-3 text-sm font-semibold text-gray-700 text-center">
              {menu.title}
            </p>

          </button>

        ))}

      </div>

    </div>

  )

}