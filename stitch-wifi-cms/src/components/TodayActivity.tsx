import { useData } from "../context/DataContext"

export default function TodayActivity() {

  const { customers, payments, invoices } = useData()

  const activities = [
    {
      icon: "payments",
      color: "bg-green-100 text-green-600",
      title: `${payments.length} Pembayaran Masuk`,
      subtitle: "Total pembayaran diterima",
      time: "08:12",
    },
    {
      icon: "person_add",
      color: "bg-blue-100 text-blue-600",
      title: `${customers.length} Pelanggan`,
      subtitle: "Pelanggan terdaftar",
      time: "07:45",
    },
    {
      icon: "receipt_long",
      color: "bg-orange-100 text-orange-600",
      title: `${invoices.filter(i => i.status !== "Lunas").length} Tagihan`,
      subtitle: "Belum dibayar",
      time: "07:20",
    },
    {
      icon: "wifi_tethering_error",
      color: "bg-purple-100 text-purple-600",
      title: "1 Gangguan",
      subtitle: "Laporan masuk",
      time: "06:45",
    },
  ]

  return (

    <div className="bg-white rounded-3xl shadow-lg p-5">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-lg font-bold text-gray-800">
          📊 Aktivitas Hari Ini
        </h2>

        <span className="material-symbols-outlined text-gray-400">
          chevron_right
        </span>

      </div>

      <div className="space-y-4">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-4">

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>
              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.subtitle}
                </p>

              </div>

            </div>

            <span className="text-sm text-gray-400">
              {item.time}
            </span>

          </div>

        ))}

      </div>

    </div>

  )

}