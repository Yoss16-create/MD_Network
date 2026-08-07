import { useData } from "../context/DataContext"

export default function RecentActivity() {

  const { customers, invoices, payments } = useData()

  const activities = [

    ...payments.slice(0, 3).map(payment => ({
      title: `Pembayaran dari ${payment.name}`,
      subtitle: `${payment.amount.toLocaleString("id-ID")} • ${payment.method}`,
      time: `${payment.date} • ${payment.time}`,
      icon: "payments",
      color: "bg-green-100 text-green-600",
    })),

    ...invoices
      .filter(invoice => invoice.status !== "Lunas")
      .slice(0, 2)
      .map(invoice => ({
        title: `Invoice ${invoice.name}`,
        subtitle: `${invoice.status} • ${invoice.period}`,
        time: invoice.due,
        icon: "receipt_long",
        color: "bg-orange-100 text-orange-600",
      })),

    ...customers
      .slice(-2)
      .reverse()
      .map(customer => ({
        title: `Pelanggan Baru`,
        subtitle: customer.name,
        time: customer.joinDate,
        icon: "person_add",
        color: "bg-blue-100 text-blue-600",
      })),

  ].slice(0, 6)

  return (

    <div className="bg-white rounded-3xl shadow-xl p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-lg font-bold text-gray-800">
            Aktivitas Terbaru
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Riwayat aktivitas terbaru sistem
          </p>

        </div>

        <span className="material-symbols-outlined text-4xl text-blue-600">
          history
        </span>

      </div>

      <div className="space-y-4">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="
              flex
              items-center
              gap-4
              p-3
              rounded-2xl
              hover:bg-gray-50
              transition
            "
          >

            <div
              className={`
                w-12
                h-12
                rounded-full
                flex
                items-center
                justify-center
                ${activity.color}
              `}
            >

              <span className="material-symbols-outlined">
                {activity.icon}
              </span>

            </div>

            <div className="flex-1">

              <h3 className="font-semibold text-gray-800">
                {activity.title}
              </h3>

              <p className="text-sm text-gray-500">
                {activity.subtitle}
              </p>

            </div>

            <div className="text-xs text-gray-400 text-right">
              {activity.time}
            </div>

          </div>

        ))}

      </div>

    </div>

  )

}