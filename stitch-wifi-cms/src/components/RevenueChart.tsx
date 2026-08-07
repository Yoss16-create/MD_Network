import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

import { useData } from "../context/DataContext"

export default function RevenueChart() {

  const { payments } = useData()

  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ]

  const chartData = months.map((month) => {

    const total = payments
      .filter(payment => {

        const paymentMonth = payment.date.split(" ")[1]

        return paymentMonth === month

      })
      .reduce((sum, payment) => sum + payment.amount, 0)

    return {
      month,
      total,
    }

  })

  return (

    <div className="bg-white rounded-3xl shadow-xl p-6">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-lg font-bold text-gray-800">
            Pendapatan Bulanan
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Total pembayaran yang telah diterima
          </p>

        </div>

        <span
          className="
            material-symbols-outlined
            text-4xl
            text-blue-600
          "
        >
          monitoring
        </span>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={chartData}>

            <defs>

              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">

                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tickFormatter={(value) => `${value / 1000}K`}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) =>
                "Rp " + Number(value).toLocaleString("id-ID")
              }
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  )

}