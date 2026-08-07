import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useData } from "../context/DataContext"
export default function MobileHeader() {
  const navigate = useNavigate()

  const {customers, payments} = useData()

const [showNotification, setShowNotification] = useState(false)
const notifications = [
  ...customers
    .filter((c: any) =>
      c.status === "Jatuh Tempo" ||
      c.status === "Belum Bayar" ||
      c.status === "Nunggak"
    )
    .map((c: any) => ({
      icon: "🔴",
      text: `${c.name} memiliki tagihan ${c.status}`,
    })),

  ...payments
    .filter((p: any) => p.status === "Lunas")
    .slice(-5)
    .reverse()
    .map((p: any) => ({
      icon: "🟢",
      text: `Pembayaran Rp ${p.amount.toLocaleString("id-ID")} diterima`,
    })),
]
  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        h-16
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        flex
        items-center
        justify-between
        px-4
        z-[999]
        shadow-md
      "
    >

      {/* Logo */}

      <div className="flex items-center gap-3">

        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-white
            flex
            items-center
            justify-center
            shadow
          "
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-8 h-8 rounded-lg"
          />
        </div>

        <div>

          <h1 className="text-sm font-bold text-white">
            MD_Network
          </h1>

          <p className="text-[11px] text-blue-100">
            Admin Console
          </p>

        </div>

      </div>

      {/* Action */}

      <div className="flex items-center gap-2">

        {/* NOTIFIKASI */}

        <button
        
          onClick={() => setShowNotification(!showNotification)}
          className="
            relative
            w-10
            h-10
            rounded-full
            bg-white/20
            hover:bg-white/30
            flex
            items-center
            justify-center
            transition
          "
      >
          <span className="material-symbols-outlined text-white">
            notifications
          </span>

          {notifications.length > 0 && (

  <span
    className="
      absolute
      -top-1
      -right-1
      min-w-[20px]
      h-5
      px-1
      rounded-full
      bg-red-500
      text-white
      text-[10px]
      font-bold
      flex
      items-center
      justify-center
    "
  >
    {notifications.length}
  </span>

)}
        </button>

        {/* PROFILE */}

        <button
        
         onClick={() => navigate("/profile")}
          className="
            w-10
            h-10
            rounded-full
            bg-white/20
            hover:bg-white/30
            flex
            items-center
            justify-center
            transition
          "
        >
          <span className="material-symbols-outlined text-white">
            account_circle
          </span>
          </button>
          

</div>
{/* PANEL NOTIFIKASI */}

{showNotification && (
  <div
  className="
    absolute
    top-16
    right-3
    w-[340px]
    max-w-[92vw]
    bg-white
    rounded-3xl
    shadow-2xl
    overflow-hidden
    z-[9999]
  "
>
 

<div className="bg-blue-600 text-white px-5 py-4">

  <div className="flex justify-between items-center">

    <h3 className="font-bold">
      🔔 Notifikasi
    </h3>

    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">

      {notifications.length}

    </span>

  </div>

</div>

<div className="p-4"></div>

    <div className="space-y-3">

  {notifications.length === 0 ? (

    <p className="text-gray-500 text-sm">
      Tidak ada notifikasi
    </p>

  ) : (

    notifications.map((item, index) => (

      <div
        key={index}
        className="flex items-start gap-3 border-b border-gray-100 pb-3"
      >
        <span className="text-lg">
          {item.icon}
        </span>

        <span className="text-sm text-gray-700">
          {item.text}
        </span>

      </div>

    ))

  )}

</div>
  </div>
)}

</header>

  )
}
