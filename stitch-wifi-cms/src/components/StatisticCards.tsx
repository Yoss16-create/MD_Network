import { useNavigate } from "react-router-dom"
import { useData } from "../context/DataContext"

export default function StatisticCards() {

  const navigate = useNavigate()

  const { customers, invoices, payments } = useData()

  const totalCustomers = customers.length

  const activeCustomers = customers.filter(
    customer => customer.status === "Aktif"
  ).length

  const unpaidInvoices = invoices.filter(
    invoice => invoice.status !== "Lunas"
  ).length

  const totalIncome = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  )

  const cards = [
    {
      title: "Total Pelanggan",
      value: totalCustomers,
      icon: "groups",
      color: "bg-blue-100 text-blue-600",
      border: "border-t-4 border-blue-500",
      link: "/customers",
    },
    {
      title: "Pelanggan Aktif",
      value: activeCustomers,
      icon: "wifi",
      color: "bg-green-100 text-green-600",
      border: "border-t-4 border-green-500",
      link: "/customers",
    },
    {
      title: "Jatuh Tempo",
      value: unpaidInvoices,
      icon: "warning",
      color: "bg-orange-100 text-orange-600",
      border: "border-t-4 border-orange-500",
      link: "/billing",
    },
    {
      title: "Pendapatan",
      value:
        "Rp " +
        (totalIncome / 1000000)
          .toFixed(1)
          .replace(".", ",") +
        " JT",
      icon: "payments",
      color: "bg-purple-100 text-purple-600",
      border: "border-t-4 border-purple-500",
      link: "/payments",
    },
  ]

  return (

    <div className="grid grid-cols-2 gap-4">

      {cards.map((card) => (

        <button
          key={card.title}
          onClick={() => navigate(card.link)}
          className={`
            ${card.border}
            bg-white
            rounded-3xl
            min-h-[165px]
            p-5
            shadow-md
            hover:shadow-xl
            hover:-translate-y-1
            active:scale-95
            transition-all
            duration-300
            flex
            flex-col
            items-center
            justify-center
            text-center
          `}
        >

          <div
            className={`
              w-14
              h-14
              rounded-full
              flex
              items-center
              justify-center
              ${card.color}
            `}
          >

            <span className="material-symbols-outlined text-2xl">
              {card.icon}
            </span>

          </div>

          <p className="mt-4 text-sm font-semibold text-gray-500">
            {card.title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 whitespace-nowrap">
            {card.value}
          </h2>

        </button>

      ))}

    </div>

  )

}