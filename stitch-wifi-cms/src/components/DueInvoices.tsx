import { useData } from "../context/DataContext"

export default function DueInvoices() {

  const { invoices } = useData()

  const dueInvoices = invoices
    .filter(invoice => invoice.status !== "Lunas")
    .slice(0, 5)

  return (

    <div className="bg-white rounded-3xl shadow-xl p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-lg font-bold text-gray-800">
            Tagihan Jatuh Tempo
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Invoice yang perlu segera ditindaklanjuti
          </p>

        </div>

        <span className="material-symbols-outlined text-4xl text-orange-500">
          warning
        </span>

      </div>

      <div className="space-y-4">

        {dueInvoices.map((invoice) => (

          <div
            key={invoice.no}
            className="
              flex
              items-center
              justify-between
              p-4
              rounded-2xl
              border
              border-gray-100
              hover:bg-orange-50
              transition
            "
          >

            <div>

              <h3 className="font-semibold text-gray-800">
                {invoice.name}
              </h3>

              <p className="text-sm text-gray-500">
                {invoice.no}
              </p>

            </div>

            <div className="text-right">

              <p className="font-bold text-orange-600">
                Rp {invoice.amount.toLocaleString("id-ID")}
              </p>

              <span
                className="
                  inline-block
                  mt-1
                  px-3
                  py-1
                  rounded-full
                  bg-orange-100
                  text-orange-700
                  text-xs
                  font-semibold
                "
              >
                {invoice.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}